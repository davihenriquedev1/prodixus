import { Pencil, Plus } from "lucide-react";
import { motion } from "motion/react";
import type { Task } from "@/features/tasks/types/task";
import { TaskActions } from "./task-actions";

interface ProjectTaskItemProps {
  task: Task;
  primaryColor: string;
  accentColor: string;
  isSelected: boolean;
  onSelect: (task: Task) => void;
  onCompletionToggle: (task: Task) => void;
  onArchive: (task: Task) => void;
  onDelete: (task: Task) => void;
  onOpenDetails: (task: Task) => void;
  // onAddNewSubtask: (task: Task) => void;
}

export function ProjectTaskItem({
  task,
  primaryColor,
  accentColor,
  isSelected,
  onSelect,
  onCompletionToggle,
  onArchive,
  onDelete,
  onOpenDetails,
  // onAddNewSubtask,
}: ProjectTaskItemProps) {
  return (
    <motion.div
      layout
      transition={{
        layout: {
          duration: 0.4,
          ease: "easeInOut",
        },
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(task);
      }}
      className={`relative group flex items-center gap-3 rounded-md border px-3 py-2 transition-colors ${
        isSelected
          ? "border-slate-600 bg-slate-800/40"
          : "border-slate-800/50 bg-slate-800/10 hover:bg-slate-800/40"
      } ${task.completed ? "opacity-25 bg-transparent/95" : ""}`}
    >
      <button
        type="button"
        aria-label={
          task.completed
            ? `Marcar ${task.title} como incompleta`
            : `Marcar ${task.title} como concluída`
        }
        title={
          task.completed ? "Desmarcar como concluída" : "Marcar como concluída"
        }
        onClick={(event) => {
          event.stopPropagation();
          onCompletionToggle(task);
        }}
        className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all relative"
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
        title={task.title}
        className="min-w-0 flex-1 cursor-pointer truncate text-left text-sm transition-colors p-1"
      >
        {task.title}
      </button>

      <div className="flex items-center">
        <button
          type="button"
          aria-label={`Adicionar subtarefa`}
          title="Adicionar subtarefa"
          className={`flex shrink-0 cursor-pointer items-center justify-center hover:bg-slate-800 p-1.5 ${!isSelected ? "opacity-0 transition-all group-hover:opacity-100 " : ""}`}
          style={{ color: accentColor }}
        >
          <Plus className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label={`Editar ${task.title}`}
          title="Editar tarefa"
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetails(task);
          }}
          className={`flex shrink-0 cursor-pointer items-center justify-center hover:bg-slate-800 p-2 ${!isSelected ? "opacity-0 transition-all group-hover:opacity-100 " : ""}`}
          style={{ color: accentColor }}
        >
          <Pencil className="h-5 w-5" />
        </button>
        <div
          className={`${!isSelected ? "opacity-0 transition-all group-hover:opacity-100 " : ""}`}
        >
          <TaskActions
            taskCompleted={task.completed}
            onEdit={() => onOpenDetails(task)}
            onCompletionToggle={() => onCompletionToggle(task)}
            onArchive={() => onArchive(task)}
            onDelete={() => onDelete(task)}
            size={6}
            color={accentColor}
          />
        </div>
      </div>
      {task.completed && (
        <div className="pointer-events-none absolute inset-x-3 top-1/2 h-px bg-slate-400/70" />
      )}
    </motion.div>
  );
}
