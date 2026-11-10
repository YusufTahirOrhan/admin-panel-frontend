import "./public.css";
import "./motion.css";
import "./theme.css";
import { PublishedHomeProvider } from "@/components/public/published-home-provider";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublishedHomeProvider>{children}</PublishedHomeProvider>;
}
