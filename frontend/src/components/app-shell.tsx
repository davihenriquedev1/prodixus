"use client";

import { AnimatePresence } from "motion/react";

import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";
import { Panel } from "./ui/panel";

import { usePanel } from "@/contexts/panel-context";
import { ProjectSettings } from "@/features/projects/components/project-settings";
import { TaskSettings } from "@/features/tasks/components/task-settings";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function GlobalPanel() {
  const { activePanel, closePanel, updateProjectPanel, updateTaskPanel } =
    usePanel();

  console.log("Projeto ativo no painel:", activePanel);

  return (
    <AnimatePresence>
      {activePanel && (
        <Panel key="global-panel">
          {activePanel.type === "project" ? (
            <ProjectSettings
              project={activePanel.project}
              onClose={closePanel}
              onProjectUpdated={updateProjectPanel}
            />
          ) : (
            <TaskSettings
              task={activePanel.task}
              onClose={closePanel}
              onTaskUpdated={updateTaskPanel}
              primaryColor={activePanel.primaryColor}
              accentColor={activePanel.accentColor}
            />
          )}
        </Panel>
      )}
    </AnimatePresence>
  );
}

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const tagId = searchParams.get("tagId");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarOpen(window.innerWidth > 768);
  }, []);

  useEffect(() => {
    if ((projectId || tagId) && window.innerWidth <= 768) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarOpen(false);
    }
  }, [projectId, tagId]);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background font-sans text-foreground antialiased">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
        <GlobalPanel />
      </div>
    </div>
  );
}
