"use client";

import { SettingsSidebar } from "./settings-sidebar";

interface SettingsShellProps {
  children: React.ReactNode;
}

export function SettingsShell({ children }: SettingsShellProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground antialiased">
      <SettingsSidebar />

      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
