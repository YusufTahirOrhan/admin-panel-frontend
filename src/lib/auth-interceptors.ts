import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

interface SessionHandlers {
  refresh: () => Promise<string>;
  getAccessToken: () => string | null;
  setAccessToken: (token: string) => void;
  onSessionExpired: () => void;
}

/** Share one refresh between concurrent requests and retry each request at most once. */
export function installAuthRefreshInterceptor(client: AxiosInstance, session: SessionHandlers) {
  let refreshPromise: Promise<string> | null = null;

  return client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const failure = error as { config?: RetryConfig; response?: { status?: number } };
      const request = failure?.config;
      const isPublicRequest = /\/api\/v1\/(?:auth|public)(?:\/|$)/.test(request?.url ?? "");

      // A permission denial must reach the screen without ending a valid session.
      if (!request || failure.response?.status !== 401 || request._retry || isPublicRequest) {
        return Promise.reject(error);
      }

      request._retry = true;
      const currentToken = session.getAccessToken();
      if (currentToken && request.headers.get("Authorization") !== `Bearer ${currentToken}`) {
        request.headers.set("Authorization", `Bearer ${currentToken}`);
        return client(request);
      }

      if (!refreshPromise) {
        refreshPromise = session.refresh()
          .then((token) => {
            session.setAccessToken(token);
            return token;
          })
          .catch((refreshError: unknown) => {
            session.onSessionExpired();
            throw refreshError;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const token = await refreshPromise;
      request.headers.set("Authorization", `Bearer ${token}`);
      return client(request);
    },
  );
}
