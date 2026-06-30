FROM node:22-alpine AS deps
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_API_URL
ARG PANEL_ORIGIN
ARG PANEL_HOSTNAMES

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV PANEL_ORIGIN=${PANEL_ORIGIN}
ENV PANEL_HOSTNAMES=${PANEL_HOSTNAMES}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

ARG NEXT_PUBLIC_API_URL
ARG PANEL_ORIGIN
ARG PANEL_HOSTNAMES

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV PANEL_ORIGIN=${PANEL_ORIGIN}
ENV PANEL_HOSTNAMES=${PANEL_HOSTNAMES}

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD ["npm", "run", "start"]
