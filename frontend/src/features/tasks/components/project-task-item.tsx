import { MoreHorizontal, Plus } from "lucide-react";

import type { Task } from "@/features/tasks/types/task";

interface ProjectTaskItemProps {
  task: Task;
  primaryColor: string;
  accentColor: string;
  onCompletionToggle: (task: Task) => void;
  onOpenDetails: (task: Task) => void;
  onAddNewSubtask: (task: Task) => void;
}

export function ProjectTaskItem({
  task,
  primaryColor,
  accentColor,
  onCompletionToggle,
  onOpenDetails,
  onAddNewSubtask,
}: ProjectTaskItemProps) {
  return (
    <div className="group flex items-center gap-3 px-3 py-2 transition-colors bg-slate-800/10 hover:bg-slate-800/40">
      <button
        type="button"
        aria-label={
          task.completed
            ? `Marcar ${task.title} como incompleta`
            : `Marcar ${task.title} como concluída`
        }
        title={
          task.completed ? "Marcar como incompleta" : "Marcar como concluída"
        }
        onClick={() => onCompletionToggle(task)}
        className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all"
        style={{
          borderColor: task.completed ? primaryColor : `${primaryColor}99`,
          backgroundColor: task.completed ? primaryColor : "transparent",
        }}
      >
        {task.completed && (
          <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onOpenDetails(task)}
        title={task.title}
        className={`min-w-0 flex-1 cursor-pointer truncate text-left text-sm transition-colors ${
          task.completed ? "text-slate-500 line-through" : "text-slate-200"
        }`}
      >
        {task.title}
      </button>

      <div className="flex items-center">
        <button
          type="button"
          aria-label={`Adicionar subtarefa`}
          title="Adicionar subtarefa"
          onClick={() => onAddNewSubtask(task)}
          className="flex p-1.5 shrink-0 cursor-pointer items-center justify-center opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-800"
          style={{ color: accentColor }}
        >
          <Plus className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label={`Abrir detalhes de ${task.title}`}
          title="Abrir detalhes"
          onClick={() => onOpenDetails(task)}
          className="flex p-1.5 shrink-0 cursor-pointer items-center justify-center opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-800"
          style={{ color: accentColor }}
        >
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
