import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-full bg-[#0A0C10] text-[#E2E8F0] font-sans antialiased overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />
        {children}
      </main>
    </div>
  );
}
