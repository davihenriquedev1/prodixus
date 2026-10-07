import {
  ChevronDown,
  ChevronUp,
  FileText,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Task } from "@/features/tasks/types/task";
import { ProjectTaskActions } from "./project-task-actions";
import type { MovePosition } from "@/types/move-position";
import { KeyboardEventHandler, RefObject, useState } from "react";
import { TaskTitleInput } from "./task-title-input";
import { TaskTags } from "./task-tags";

interface ProjectTaskItemProps {
  task: Task;
  subtasks: Task[];
  primaryColor: string;
  accentColor: string;
  parentTaskId: string | null;

  onSelect: (task: Task) => void;
  onCompletionToggle: (task: Task) => void;
  onMove: (task: Task, position: MovePosition) => void;
  onConvertToParent: (subtask: Task) => void;
  onArchive: (task: Task) => void;
  onDelete: (task: Task) => void;
  onOpenDetails: (task: Task) => void;
  onEditTags: (task: Task, position: MovePosition) => void;
  onCreateSubtask: (parentTaskId: string) => void;
  selectedTask: Task | null;

  newSubtaskInputRef: RefObject<HTMLInputElement | null>;
  newSubtaskItemRef: RefObject<HTMLDivElement | null>;
  newSubtaskTitle: string;
  setNewSubtaskTitle: (title: string) => void;
  isCreatingSubtask: boolean;

  onTitleUpdate: (task: Task, title: string) => void;

  handleKeyDownCreatingSubtask: KeyboardEventHandler<HTMLInputElement>;
  pendingTaskId: string | null;
}

export function ProjectTaskItem({
  task,
  subtasks,
  primaryColor,
  accentColor,
  parentTaskId,
  onSelect,
  selectedTask,
  onCompletionToggle,
  onMove,
  onConvertToParent,
  onArchive,
  onDelete,
  onOpenDetails,
  onEditTags,
  onCreateSubtask,
  newSubtaskInputRef,
  newSubtaskItemRef,
  newSubtaskTitle,
  setNewSubtaskTitle,
  isCreatingSubtask,
  handleKeyDownCreatingSubtask,
  pendingTaskId,
  onTitleUpdate,
}: ProjectTaskItemProps) {
  const [openSubtasks, setOpenSubtasks] = useState(false);

  const isTaskSelected = selectedTask?.id === task.id;

  const isSubtaskSelected = subtasks.some(
    (subtask) => subtask.id === selectedTask?.id,
  );

  const isSelected = isTaskSelected || isSubtaskSelected;

  const isTaskPending = pendingTaskId === task.id;

  return (
    <motion.div
      onClick={(event) => {
        event.stopPropagation();
        onSelect(task);
      }}
      className={`
        relative cursor-pointer flex flex-col overflow-hidden transition-colors
        ${subtasks.length > 0 ? " border" : ""}
        ${
          isSelected
            ? "bg-slate-800/40"
            : "bg-slate-800/10 hover:bg-slate-800/40"
        }
      `}
      style={
        subtasks.length > 0 && isSelected
          ? { borderColor: accentColor }
          : { borderColor: "#1d293d" }
      }
    >
      <div
        onClick={(event) => {
          event.stopPropagation();
          onSelect(task);
        }}
        className={`relative group flex flex-col px-2.5 py-1.5 transition-colors ${
          subtasks.length === 0 ? "border" : openSubtasks ? "border-b" : ""
        } ${isTaskSelected ? "bg-slate-800/70" : "hover:bg-slate-800/20"}
          } ${task.completed ? "opacity-25 bg-transparent/95" : ""}`}
        style={
          isTaskSelected
            ? { borderColor: accentColor }
            : { borderColor: "#1d293d" }
        }
      >
        <div className="flex items-center gap-2">
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
            className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all relative disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderColor: task.completed ? primaryColor : `${primaryColor}99`,
              backgroundColor: task.completed ? primaryColor : "transparent",
            }}
          >
            {task.completed && (
              <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
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
              aria-label={`Adicionar subtarefa`}
              title="Adicionar subtarefa"
              onClick={(event) => {
                event.stopPropagation();
                setOpenSubtasks(true);
                onCreateSubtask(task.id);
              }}
              className={`flex shrink-0 cursor-pointer items-center justify-center hover:bg-slate-800 p-1.5 disabled:cursor-not-allowed disabled:opacity-30 ${!isTaskSelected ? "opacity-0 transition-all group-hover:opacity-100 " : ""}`}
              style={{ color: accentColor }}
            >
              <Plus className="h-6 w-6" />
            </button>
            <button
              type="button"
              disabled={isTaskPending}
              aria-label={`Editar ${task.title}`}
              title="Ver detalhes da tarefa"
              onClick={(event) => {
                event.stopPropagation();
                onOpenDetails(task);
              }}
              className={`flex shrink-0 cursor-pointer items-center justify-center hover:bg-slate-800 p-2 disabled:cursor-not-allowed disabled:opacity-30 ${!isTaskSelected ? "opacity-0 transition-all group-hover:opacity-100 " : ""}`}
              style={{ color: accentColor }}
            >
              <FileText className="h-5 w-5" />
            </button>
            <div
              className={`${!isTaskSelected ? "opacity-0 transition-all group-hover:opacity-100 " : ""}`}
            >
              <ProjectTaskActions
                disabled={isTaskPending}
                taskCompleted={task.completed}
                onEdit={() => onOpenDetails(task)}
                onCompletionToggle={() => onCompletionToggle(task)}
                onMove={(position) => onMove(task, position)}
                onArchive={() => onArchive(task)}
                onDelete={() => onDelete(task)}
                onEditTags={(position) => onEditTags(task, position)}
                size={6}
                color={accentColor}
              />
            </div>
            {task.completed && (
              <div
                className={`pointer-events-none absolute inset-x-3 ${task.tags.length > 0 ? "top-[38%]" : "top-1/2"} h-px bg-slate-400/70`}
              />
            )}
          </div>
        </div>

        {task.tags.length > 0 && <TaskTags tags={task.tags} />}
      </div>

      {subtasks.length > 0 && (
        <div
          title="Ver subtarefas"
          className={`cursor-pointer flex justify-center transition-colors
            ${isTaskSelected && !openSubtasks ? "bg-slate-600/50 hover:brightness-120" : !isTaskSelected ? " hover:bg-black/10 " : ""} 
            ${task.completed ? "opacity-10 hover:bg-slate-600/40  " : ""}
          `}
          onClick={() => setOpenSubtasks(!openSubtasks)}
        >
          {openSubtasks ? (
            <ChevronUp className="h-4 w-4 text-slate-500/80" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500/80" />
          )}
        </div>
      )}

      {isCreatingSubtask && parentTaskId === task.id && (
        <>
          {subtasks.length === 0 && (
            <ChevronUp className="h-4 w-4 text-slate-500/80 opacity-30 self-center" />
          )}
          <div
            ref={newSubtaskItemRef}
            className="group flex items-center gap-3 bg-slate-800/10 px-3 py-2 mx-2 mb-2"
            style={{
              border: `1px solid ${accentColor}`,
            }}
          >
            <div className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-500 opacity-40" />

            <input
              ref={newSubtaskInputRef}
              type="text"
              value={newSubtaskTitle}
              onChange={(event) => setNewSubtaskTitle(event.target.value)}
              onKeyDown={handleKeyDownCreatingSubtask}
              placeholder="Nome da tarefa..."
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent p-1 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border focus:border-slate-600/40"
            />

            <div className="flex items-center">
              <div className="flex shrink-0 items-center justify-center p-1.5">
                <MoreHorizontal className="h-6 w-6 text-slate-500/30" />
              </div>
            </div>
          </div>
        </>
      )}
      <AnimatePresence initial={false}>
        <motion.div>
          {openSubtasks &&
            subtasks.map((subtask) => {
              const isSubtaskSelected = selectedTask?.id === subtask.id;
              const isSubtaskPending = pendingTaskId === subtask.id;

              return (
                <motion.div
                  key={subtask.id}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(subtask);
                  }}
                  className={`
                    relative group flex items-center gap-3 border px-3 py-1.5 transition-colors mx-2 mb-2 
                    ${
                      isSubtaskSelected
                        ? "bg-slate-800/70"
                        : "border-slate-800/50  hover:bg-slate-800/20"
                    } ${subtask.completed ? "opacity-25 bg-transparent/95" : ""}`}
                  style={
                    isSubtaskSelected ? { borderColor: accentColor } : undefined
                  }
                >
                  <button
                    type="button"
                    disabled={isSubtaskPending}
                    aria-label={
                      subtask.completed
                        ? `Marcar ${subtask.title} como incompleta`
                        : `Marcar ${subtask.title} como concluída`
                    }
                    title={
                      subtask.completed
                        ? "Desmarcar como concluída"
                        : "Marcar como concluída"
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      onCompletionToggle(subtask);
                    }}
                    className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all relative disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      borderColor: subtask.completed
                        ? primaryColor
                        : `${primaryColor}99`,
                      backgroundColor: subtask.completed
                        ? primaryColor
                        : "transparent",
                    }}
                  >
                    {subtask.completed && (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
                    )}
                  </button>

                  <TaskTitleInput
                    task={subtask}
                    disabled={isSubtaskPending}
                    onUpdate={onTitleUpdate}
                  />

                  <div className="flex items-center">
                    <button
                      disabled={isSubtaskPending}
                      type="button"
                      aria-label={`Editar ${subtask.title}`}
                      title="Editar tarefa"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenDetails(subtask);
                      }}
                      className={`flex shrink-0 cursor-pointer items-center justify-center hover:bg-slate-800 p-2 disabled:cursor-not-allowed disabled:opacity-50 ${!isSubtaskSelected ? "opacity-0 transition-all group-hover:opacity-100 " : ""}`}
                      style={{ color: accentColor }}
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                    <div
                      className={`${!isSubtaskSelected ? "opacity-0 transition-all group-hover:opacity-100 " : ""}`}
                    >
                      <ProjectTaskActions
                        taskCompleted={subtask.completed}
                        onEdit={() => onOpenDetails(subtask)}
                        onConvertToParent={() => onConvertToParent(subtask)}
                        onCompletionToggle={() => onCompletionToggle(subtask)}
                        onArchive={() => onArchive(subtask)}
                        onDelete={() => onDelete(subtask)}
                        size={6}
                        color={accentColor}
                        disabled={isSubtaskPending}
                      />
                    </div>
                  </div>
                  {subtask.completed && (
                    <div className="pointer-events-none absolute inset-x-3 top-1/2 h-px bg-slate-400/70" />
                  )}
                </motion.div>
              );
            })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
