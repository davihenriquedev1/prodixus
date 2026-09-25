"use client";

import { Layers3, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Task } from "@/features/tasks/types/task";
import { ProjectActions } from "@/features/projects/components/project-actions";
import { getProjects } from "@/features/projects/services/project.service";
import type { Project } from "@/features/projects/types/project";
import { ProjectTaskList } from "@/features/tasks/components/project-task-list";
import { updateTask } from "@/features/tasks/services/task.service";
import { ProtectedRoute } from "@/features/auth/components/protected-routes";
import { AppShell } from "@/components/app-shell";

export default function TasksPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      if (!projectId) {
        setProject(null);
        setIsLoading(false);
        return;
      }

      try {
        const projects = await getProjects();

        setProject(projects.find((item) => item.id === projectId) ?? null);
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  async function handleCompletionToggle(task: Task) {
    return updateTask(task.id, {
      completed: !task.completed,
    });
  }

  function handleOpenDetails(task: Task) {
    setSelectedTask(task);
  }

  if (isLoading) {
    return (
      <main className="flex-1 p-6">
        <div className="py-20 text-center text-sm text-slate-500">
          Carregando...
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex-1 p-6">
        <div className="py-20 text-center text-sm text-slate-500">
          Projeto não encontrado.
        </div>
      </main>
    );
  }

  const primaryColor = project.primaryColor ?? "#64748B";
  const accentColor = project.accentColor ?? "#64748B";
  const errorColor = project.errorColor ?? "#EF4444";

  return (
    <ProtectedRoute>
      <AppShell>
        <main className="relative flex-1 overflow-hidden p-4">
          <div
            className="pointer-events-none absolute -right-32 z-0 -top-32 h-150 w-150 rounded-full blur-[80px]"
            style={{
              backgroundColor: primaryColor,
              opacity: 0.02,
            }}
          />
          <div className="flex items-center justify-between pb-4 z-10">
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-1 rounded-full"
                style={{
                  backgroundColor: primaryColor,
                  borderBottom: "1px solid ",
                  borderColor: primaryColor,
                }}
              />

              <div className="flex">
                <Layers3
                  className="w-6 h-6 mr-2"
                  style={{ fill: primaryColor }}
                />
                <h1 className="text-base font-semibold">{project.name}</h1>
              </div>
            </div>

            <div className="flex items-center pr-1 ">
              <button
                type="button"
                title="Criar nova tarefa"
                onClick={() => {}}
                className="flex cursor-pointer items-center p-1.5 transition-opacity opacity-80 hover:opacity-100 hover:bg-slate-800/60"
                style={{ color: primaryColor }}
              >
                <Plus className="h-6 w-6" />
              </button>

              <ProjectActions
                projectCompleted={project.completed}
                onEdit={() => {}}
                onCompletionToggle={() => {}}
                onArchive={() => {}}
                onDelete={() => {}}
                size={6}
              />
            </div>
          </div>
          <div
            className="opacity-20 mb-4"
            style={{ borderBottom: "1px solid", borderColor: primaryColor }}
          ></div>

          <ProjectTaskList
            projectId={project.id}
            primaryColor={primaryColor}
            accentColor={accentColor}
            errorColor={errorColor}
            onCompletionToggle={handleCompletionToggle}
            onOpenDetails={handleOpenDetails}
          />
        </main>
      </AppShell>
    </ProtectedRoute>
  );
}
