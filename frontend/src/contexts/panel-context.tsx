import { createContext, useContext, useState, type ReactNode } from "react";

import type { Project } from "@/features/projects/types/project";
import type { Task } from "@/features/tasks/types/task";

type ActivePanel =
  | {
      type: "project";
      project: Project;
    }
  | {
      type: "task";
      task: Task;
      primaryColor: string;
      accentColor: string;
    }
  | null;

interface PanelContextValue {
  activePanel: ActivePanel;
  openProjectPanel: (project: Project) => void;
  openTaskPanel: (
    task: Task,
    primaryColor: string,
    accentColor: string,
  ) => void;
  closePanel: () => void;
  updateProjectPanel: (project: Project) => void;
  updateTaskPanel: (task: Task) => void;
}

const PanelContext = createContext<PanelContextValue | undefined>(undefined);

interface PanelProviderProps {
  children: ReactNode;
}

export function PanelProvider({ children }: PanelProviderProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  function openProjectPanel(project: Project) {
    setActivePanel({
      type: "project",
      project,
    });
  }

  function openTaskPanel(
    task: Task,
    primaryColor = "#64748B",
    accentColor = "#64748B",
  ) {
    setActivePanel({
      type: "task",
      task,
      primaryColor,
      accentColor,
    });
  }

  function closePanel() {
    setActivePanel(null);
  }

  function updateProjectPanel(project: Project) {
    setActivePanel((current) => {
      if (current?.type !== "project" || current.project.id !== project.id) {
        return current;
      }
      return {
        type: "project",
        project,
      };
    });
  }

  function updateTaskPanel(task: Task) {
    setActivePanel((current) => {
      if (current?.type !== "task" || current.task.id !== task.id) {
        return current;
      }

      return {
        ...current,
        task,
      };
    });
  }

  return (
    <PanelContext.Provider
      value={{
        activePanel,
        openProjectPanel,
        openTaskPanel,
        closePanel,
        updateProjectPanel,
        updateTaskPanel,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}

export function usePanel() {
  const context = useContext(PanelContext);

  if (!context) {
    throw new Error("usePanel deve ser usado dentro de um PanelProvider.");
  }

  return context;
}
