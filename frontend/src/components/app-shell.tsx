"use client";

import { AnimatePresence } from "motion/react";

import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";
import { Panel } from "./ui/panel";

import { usePanel } from "@/contexts/panel-context";
import { ProjectSettings } from "@/features/projects/components/project-settings";
import { TaskSettings } from "@/features/tasks/components/task-settings";

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
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground antialiased">
      <Sidebar />

      <div className="relative flex min-w-0 flex-1 overflow-hidden">
        <main className="flex min-w-0 flex-1 flex-col">
          <Header />
          {children}
        </main>

        <GlobalPanel />
      </div>
    </div>
  );
}
