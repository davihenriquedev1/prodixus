"use client";

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Project } from "@/features/projects/types/project";
import type { Task } from "@/features/tasks/types/task";

interface ProjectOverview extends Project {
  taskCount: number;
  completedTaskCount: number;
}

interface DashboardMetricsProps {
  projects: Project[];
  tasks: Task[];
  isLoading: boolean;
  error: boolean;
}

export function ProjectsOverview({
  projects,
  tasks,
  isLoading,
  error,
}: DashboardMetricsProps) {
  const router = useRouter();

  if (isLoading || error) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-muted uppercase">
          Projetos Recentes
        </div>

        <div className="text-sm text-subtle">
          {isLoading ? "Loading projects..." : "Unable to load projects."}
        </div>
      </section>
    );
  }

  const projectsWithTasks: ProjectOverview[] = projects
    .map((project) => {
      const projectTasks = tasks.filter(
        (task) => task.projectId === project.id && !task.archived,
      );

      return {
        ...project,
        taskCount: projectTasks.length,
        completedTaskCount: projectTasks.filter((task) => task.completed)
          .length,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 3);

  if (projectsWithTasks.length === 0) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-muted uppercase">
          Projetos Recentes
        </div>

        <div className="text-sm text-subtle">No projects yet.</div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="text-xs font-semibold tracking-wider text-muted uppercase">
        Projetos Recentes
      </div>

      <div className="space-y-2">
        {projectsWithTasks.map((project) => {
          const projectColor = project.primaryColor ?? "#94a3b8";

          const progress =
            project.taskCount > 0
              ? (project.completedTaskCount / project.taskCount) * 100
              : 0;

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => router.push(`/tasks?projectId=${project.id}`)}
              className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-surface p-4 text-left transition hover:border-subtle hover:bg-surface-elevated"
            >
              <div
                className="absolute inset-y-3 left-0 w-0.5 rounded-r-full opacity-70 transition-opacity group-hover:opacity-100"
                style={{ backgroundColor: projectColor }}
              />

              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: projectColor }}
                  />

                  <span className="truncate text-xs font-semibold text-foreground">
                    {project.name}
                  </span>
                </div>

                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] text-muted">
                    {project.completedTaskCount} de {project.taskCount} tarefas
                  </span>

                  <span
                    className="text-[11px] font-medium"
                    style={{ color: projectColor }}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: projectColor,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
