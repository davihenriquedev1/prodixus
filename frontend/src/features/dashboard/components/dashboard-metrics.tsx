"use client";

import { CheckCircle2, Folder, ListTodo } from "lucide-react";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

interface DashboardMetricsProps {
  projects: Project[];
  tasks: Task[];
  isLoading: boolean;
  error: boolean;
}

export function DashboardMetrics({
  projects,
  tasks,
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
      label: "Projects",
      value: projects.length,
      icon: Folder,
    },
    {
      label: "Tasks",
      value: tasks.length,
      icon: ListTodo,
    },
    {
      label: "Completed",
      value: tasks.filter((task) => task.completed).length,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="bg-[#0D0F14]/70 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
              <Icon className="w-3.5 h-3.5" />
              <span>{metric.label}</span>
            </div>

            <div className="text-3xl font-extrabold text-slate-100">
              {metric.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
