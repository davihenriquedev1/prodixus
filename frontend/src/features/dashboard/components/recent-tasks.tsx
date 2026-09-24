"use client";

import { CheckCircle2, Circle } from "lucide-react";
import type { Task } from "@/features/tasks/types/task";

interface RecentTasksProps {
  tasks: Task[];
  isLoading: boolean;
  error: boolean;
}

export function RecentTasks({ tasks, isLoading, error }: RecentTasksProps) {
  if (isLoading) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Recent Tasks
        </div>

        <div className="text-sm text-slate-500">Loading tasks...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Recent Tasks
        </div>

        <div className="text-sm text-slate-500">
          Unable to load recent tasks.
        </div>
      </section>
    );
  }

  const recentTasks: Task[] = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  if (recentTasks.length === 0) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Recent Tasks
        </div>

        <div className="text-sm text-slate-500">No recent tasks.</div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
        Recent Tasks
      </div>

      <div className="bg-[#0D0F14]/40 border border-slate-800/80 rounded-xl divide-y divide-slate-800/50 overflow-hidden">
        {recentTasks.map((task) => (
          <div
            key={task.id}
            className="p-3.5 flex items-center justify-between hover:bg-slate-800/20 transition"
          >
            <div className="flex items-center gap-3">
              {task.completed ? (
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
              ) : (
                <Circle className="w-4 h-4 text-slate-500" />
              )}

              <span
                className={`text-xs ${
                  task.completed
                    ? "text-slate-500 line-through"
                    : "text-slate-200"
                }`}
              >
                {task.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
