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

  if (isLoading) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Projetos Recentes
        </div>

        <div className="text-sm text-slate-500">Loading projects...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Projetos Recentes
        </div>

        <div className="text-sm text-slate-500">Unable to load projects.</div>
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
        <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Projetos Recentes
        </div>

        <div className="text-sm text-slate-500">No projects yet.</div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
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
              className="w-full text-left rounded-xl p-4 border border-slate-800/70 transition group hover:border-slate-600/80 cursor-pointer"
              style={{
                background: `linear-gradient(
                  90deg,
                  rgba(15, 23, 42, 0.35) 0%,
                  ${projectColor}0A 100%
                )`,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: projectColor,
                      boxShadow: `0 0 8px ${projectColor}66`,
                    }}
                  />

                  <span className="text-sm font-medium text-slate-200 truncate">
                    {project.name}
                  </span>
                </div>

                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-slate-500">
                    {project.completedTaskCount} de {project.taskCount} tarefas
                  </span>

                  <span
                    className="text-[11px] font-medium"
                    style={{ color: projectColor }}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-slate-800/70 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: projectColor,
                      boxShadow: `0 0 8px ${projectColor}66`,
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
