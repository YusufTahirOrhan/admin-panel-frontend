import "./public.css";
import "./motion.css";
import "./theme.css";
import { cookies } from "next/headers";
import { PublicThemeProvider } from "@/components/public/public-theme";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const saved = (await cookies()).get('optimaxx-store-theme')?.value;
  const initialTheme = saved === 'light' || saved === 'dark' ? saved : 'system';
  return <PublicThemeProvider initialTheme={initialTheme}>{children}</PublicThemeProvider>;
}
