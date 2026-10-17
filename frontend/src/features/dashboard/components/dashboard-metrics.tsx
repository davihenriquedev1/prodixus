"use client";

import { CheckCircle2, Layers3, ListTodo } from "lucide-react";
import type { Project } from "@/features/projects/types/project";
import type { Task } from "@/features/tasks/types/task";

interface DashboardMetricsProps {
  activeProjects: Project[];
  activeTasks: Task[];
  completedTasks: Task[];
  isLoading: boolean;
  error: boolean;
}

export function DashboardMetrics({
  activeProjects,
  activeTasks,
  completedTasks,
  isLoading,
  error,
}: DashboardMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-border/80 bg-surface/70 p-5 backdrop-blur-sm"
          >
            <div className="mb-3 h-3 w-20 animate-pulse rounded bg-surface-elevated" />
            <div className="h-8 w-12 animate-pulse rounded bg-surface-elevated" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-subtle">
        Unable to load dashboard metrics.
      </div>
    );
  }

  const metrics = [
    {
      label: "Projetos pendentes",
      value: activeProjects.length,
      icon: Layers3,
      color: "#38BDF8",
    },
    {
      label: "Tarefas pendentes",
      value: activeTasks.length,
      icon: ListTodo,
      color: "#F59E0B",
    },
    {
      label: "Tarefas concluídas",
      value: completedTasks.length,
      icon: CheckCircle2,
      color: "#05df72",
    },
  ];

  return (
    <>
      <h1 className="text-xl uppercase text-foreground">Visão geral</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label.trim()}
              className="flex sm:flex-col items-center sm:items-start justify-between rounded-lg border border-border/40 bg-surface-elevated/20 p-4 gap-3"
            >
              <div
                className="flex items-center gap-2 text-[10px] font-semibold tracking-wider uppercase"
                style={{ color: metric.color }}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{metric.label}</span>
              </div>

              <div className="text-xl md:text-4xl font-normal text-foreground">
                {metric.value}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
