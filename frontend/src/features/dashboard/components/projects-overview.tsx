"use client";

import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

interface ProjectOverview extends Project {
  taskCount: number;
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
  if (isLoading) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Your Projects
        </div>

        <div className="text-sm text-slate-500">Loading projects...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Your Projects
        </div>

        <div className="text-sm text-slate-500">Unable to load projects.</div>
      </section>
    );
  }

  const projectsWithTasks: ProjectOverview[] = projects
    .map((project) => ({
      ...project,
      taskCount: tasks.filter((task) => task.projectId === project.id).length,
    }))
    .sort((a, b) => b.taskCount - a.taskCount)
    .slice(0, 3);

  if (projectsWithTasks.length === 0) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Your Projects
        </div>

        <div className="text-sm text-slate-500">No projects yet.</div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
        Your Projects
      </div>

      <div className="space-y-2">
        {projectsWithTasks.map((project) => (
          <div
            key={project.id}
            className="bg-[#0D0F14]/60 border border-slate-800/70 rounded-xl p-4 flex items-center justify-between hover:border-slate-600 transition group"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: project.primaryColor ?? "#94a3b8",
                }}
              />

              <span className="text-sm font-medium text-slate-200">
                {project.name}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{project.taskCount} tasks</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
