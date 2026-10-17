"use client";

import { FileText, Layers3 } from "lucide-react";
import type { Task } from "@/features/tasks/types/task";
import { TagTaskActions } from "./tag-task-actions";
import { TaskTitleInput } from "@/features/tasks/components/task-title-input";
import type { Project } from "@/features/projects/types/project";

interface TagTaskItemProps {
  task: Task;
  project: Project | null;
  color: string;

  onSelect: (task: Task) => void;
  onCompletionToggle: (task: Task) => void;
  onArchive: (task: Task) => void;
  onDelete: (task: Task) => void;
  onOpenDetails: (task: Task) => void;
  onTitleUpdate: (task: Task, title: string) => void;

  selectedTask: Task | null;
  pendingTaskId: string | null;
}

export function TagTaskItem({
  task,
  project,
  color,
  onSelect,
  onCompletionToggle,
  onArchive,
  onDelete,
  onOpenDetails,
  onTitleUpdate,
  selectedTask,
  pendingTaskId,
}: TagTaskItemProps) {
  const isTaskSelected = selectedTask?.id === task.id;
  const isTaskPending = pendingTaskId === task.id;

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        onSelect(task);
      }}
      className={`
        relative group flex flex-col border px-3 py-1.5
        cursor-pointer transition-colors
        ${
          isTaskSelected
            ? "bg-surface-elevated"
            : "bg-surface/15 hover:bg-surface/20"
        }
        ${task.completed ? "opacity-25 bg-transparent/95" : ""}
      `}
      style={{
        borderColor: isTaskSelected ? color : "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 w-full">
        <button
          type="button"
          disabled={isTaskPending}
          aria-label={
            task.completed
              ? `Marcar ${task.title} como incompleta`
              : `Marcar ${task.title} como concluída`
          }
          title={
            task.completed
              ? "Desmarcar como concluída"
              : "Marcar como concluída"
          }
          onClick={(event) => {
            event.stopPropagation();
            onCompletionToggle(task);
          }}
          className="relative flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            borderColor: task.completed ? color : `${color}99`,
            backgroundColor: task.completed ? color : "transparent",
          }}
        >
          {task.completed && (
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
          )}
        </button>
        <TaskTitleInput
          task={task}
          disabled={isTaskPending}
          onUpdate={onTitleUpdate}
        />
        <div className="flex items-center">
          <button
            type="button"
            disabled={isTaskPending}
            aria-label={`Editar ${task.title}`}
            title="Ver detalhes da tarefa"
            onClick={(event) => {
              event.stopPropagation();
              onOpenDetails(task);
            }}
            className={`
              flex shrink-0 cursor-pointer items-center justify-center
              p-2 hover:bg-surface-elevated
              disabled:cursor-not-allowed disabled:opacity-30
              ${
                !isTaskSelected
                  ? "opacity-20 transition-all group-hover:opacity-100"
                  : ""
              }
            `}
            style={{ color: color }}
          >
            <FileText className="h-5 w-5" />
          </button>
          <div
            className={`${!isTaskSelected ? "opacity-20 transition-all group-hover:opacity-100 " : ""}`}
            onClickCapture={() => onSelect(task)}
          >
            <TagTaskActions
              disabled={isTaskPending}
              taskCompleted={task.completed}
              onEdit={() => onOpenDetails(task)}
              onCompletionToggle={() => onCompletionToggle(task)}
              onArchive={() => onArchive(task)}
              onDelete={() => onDelete(task)}
              size={6}
              color={color}
            />
          </div>
        </div>
      </div>
      {project !== null && (
        <div className="flex items-center gap-1">
          <Layers3
            className="w-3 h-3 "
            stroke={project.primaryColor || "var(--color-border)"}
          />
          <span className="text-muted/80 text-xs">{project.name}</span>
        </div>
      )}

      {task.completed && (
        <div className="pointer-events-none absolute inset-x-3 top-[38%] h-px bg-muted/70" />
      )}
    </div>
  );
}
