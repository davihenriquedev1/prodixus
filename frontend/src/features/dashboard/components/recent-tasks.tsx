"use client";

import { Layers3, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Project } from "@/features/projects/types/project";
import type { Task } from "@/features/tasks/types/task";

interface RecentTasksProps {
  tasks: Task[];
  projects: Project[];
  isLoading: boolean;
  error: boolean;
}

export function RecentTasks({
  tasks,
  projects,
  isLoading,
  error,
}: RecentTasksProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-muted uppercase">
          Tarefas recentes
        </div>

        <div className="rounded-xl border border-border/70 bg-surface/20 p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-2">
                <div className="h-3.5 w-2/5 animate-pulse rounded bg-surface-elevated" />
                <div className="h-2.5 w-1/4 animate-pulse rounded bg-surface-elevated/70" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-muted uppercase">
          Tarefas recentes
        </div>

        <div className="rounded-xl border border-border/70 bg-surface/20 p-4 text-sm text-subtle">
          Não foi possível carregar as tarefas recentes.
        </div>
      </section>
    );
  }

  const recentTasks = [...tasks]
    .filter((task) => !task.archived)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  if (recentTasks.length === 0) {
    return (
      <section className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-muted uppercase">
          Tarefas recentes
        </div>

        <div className="rounded-xl border border-border/70 bg-surface/20 p-4 text-sm text-subtle">
          Nenhuma tarefa recente.
        </div>
      </section>
    );
  }

  const formatUpdatedAt = (date: string) => {
    const updatedAt = new Date(date);
    const now = new Date();

    const isToday = updatedAt.toDateString() === now.toDateString();

    if (isToday) {
      return `Hoje, ${updatedAt.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (updatedAt.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${updatedAt.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return updatedAt.toLocaleDateString("pt-BR");
  };

  return (
    <section className="space-y-3">
      <div className="text-xs font-semibold tracking-wider text-muted uppercase">
        Tarefas recentes
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-surface/20">
        {recentTasks.map((task) => {
          const project = projects.find(
            (project) => project.id === task.projectId,
          );

          const projectColor = project?.primaryColor ?? "#64748B";

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => router.push(`/tasks?projectId=${task.projectId}`)}
              className="group w-full cursor-pointer border-b border-border/50 px-4 py-2 text-left transition last:border-b-0 hover:bg-surface-elevated/50"
            >
              <div className="flex gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate text-xs font-medium transition ${
                        task.completed
                          ? "text-subtle line-through"
                          : "text-foreground group-hover:text-primary"
                      }`}
                    >
                      {task.title}
                    </span>

                    <div className="flex shrink-0 text-xs text-subtle">
                      <div>Atualizada {formatUpdatedAt(task.updatedAt)}</div>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    {project && (
                      <div className="flex items-center gap-1.5 text-[11px] text-muted">
                        <Layers3
                          className="h-3 w-3"
                          style={{ color: projectColor }}
                        />

                        <span className="max-w-32 truncate">
                          {project.name}
                        </span>
                      </div>
                    )}

                    {task.tags?.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        {task.tags.slice(0, 3).map((tag) => (
                          <div
                            key={tag.id}
                            className="flex items-center gap-1 text-[10px] text-muted"
                          >
                            <Tag
                              className="h-3 w-3"
                              style={{ color: tag.color }}
                            />

                            <span className="max-w-20 truncate">
                              {tag.name}
                            </span>
                          </div>
                        ))}

                        {task.tags.length > 3 && (
                          <span className="text-[10px] text-subtle">
                            +{task.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
