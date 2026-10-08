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
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-[#0D0F14]/70 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm"
          >
            <div className="h-3 w-20 bg-slate-800 rounded animate-pulse mb-3" />
            <div className="h-8 w-12 bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-slate-500">
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
      <h1 className="text-2xl uppercase">Visão geral</h1>
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label.trim()}
              className="flex flex-col rounded-lg p-4 border border-slate-500/40 bg-slate-600/20"
            >
              <div
                className="flex items-center gap-2 text-[10px] font-semibold tracking-wider uppercase mb-3"
                style={{ color: metric.color }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{metric.label}</span>
              </div>

              <div
                className="text-5xl font-normal"
                style={{
                  color: "#FFF",
                  textShadow: `
                    0 0 1px #ffffff,
                    0 0 30px #ffffff,
                    0 0 10px ${metric.color},
                    0 0 30px ${metric.color}99
                  `,
                }}
              >
                {metric.value}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
