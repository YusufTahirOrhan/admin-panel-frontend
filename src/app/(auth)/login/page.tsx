import { Button } from "@/components/ui/button";

export const metadata = {
  title: 'Giriş Yap - OptiMaxx',
};

export default function LoginPage() {
  return (
    <form className="mt-8 space-y-6">
      <div className="space-y-4 rounded-md shadow-sm">
        <div>
          <label htmlFor="email-address" className="sr-only">
            E-posta Adresi
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="relative block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="E-posta adresi"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="relative block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="Şifre"
          />
        </div>
      </div>

      <div>
        <Button type="submit" className="w-full">
          Giriş Yap
        </Button>
      </div>
    </form>
  );
}
