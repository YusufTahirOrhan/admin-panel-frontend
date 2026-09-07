export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="public-site flex min-h-screen flex-col bg-white">{children}</div>;
}
