import { TopNav } from "./TopNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-hf-bg">
      <TopNav />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
