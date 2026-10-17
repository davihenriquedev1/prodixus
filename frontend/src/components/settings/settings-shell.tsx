"use client";

import { useEffect, useState } from "react";
import { SettingsSidebar } from "./settings-sidebar";
import { SettingsHeader } from "./settings-header";

interface SettingsShellProps {
  children: React.ReactNode;
}

export function SettingsShell({ children }: SettingsShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    handleSwitchSidebar();
  }, []);

  function handleSwitchSidebar() {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(window.innerWidth > 768);
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground antialiased">
      <SettingsSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        switchRoute={handleSwitchSidebar}
      />

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <SettingsHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
