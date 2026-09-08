import "./public.css";
import "./motion.css";
import "./theme.css";
import { cookies } from "next/headers";
import { PublicThemeProvider } from "@/components/public/public-theme";
import { getPublishedHome } from "@/lib/published-home";
import { resolveStoreTheme } from "@/lib/store-theme";
import { getStorePalette } from "@/lib/store-palettes";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const saved = (await cookies()).get('optimaxx-store-theme')?.value;
  const { blocks } = await getPublishedHome();
  const initialTheme = resolveStoreTheme(saved, blocks);
  return <PublicThemeProvider initialTheme={initialTheme} palette={getStorePalette(blocks)}>{children}</PublicThemeProvider>;
}
