import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

// Inter is bundled from @fontsource-variable/inter instead of being downloaded from Google
// Fonts at build time: the build works offline, visitors' browsers never call Google, and the
// latin-ext subset carries the Turkish letters (ğ, ş, ı, İ) the old "latin"-only setup lacked.
const interLatin = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter-latin",
  display: "swap",
  adjustFontFallback: false,
});
const interLatinExt = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter-latin-ext",
  display: "swap",
});
const fontStack = {
  "--font-sans": "var(--font-inter-latin), var(--font-inter-latin-ext), ui-sans-serif, system-ui, sans-serif",
} as React.CSSProperties;

export const metadata: Metadata = {
  title: "OptiMaxx Management System",
  description: "Retail and Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${interLatin.variable} ${interLatinExt.variable} h-full antialiased font-sans`}
      style={fontStack}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
