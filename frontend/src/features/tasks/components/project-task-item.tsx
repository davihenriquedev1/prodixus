import { ChevronDown, ChevronUp, FileText, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Task } from "@/features/tasks/types/task";
import { ProjectTaskActions } from "./project-task-actions";
import type { MovePosition } from "@/types/move-position";
import { useState, type KeyboardEventHandler, type RefObject } from "react";
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
  handleCreateSubtask: () => void;
  handleCancelCreateSubtask: () => void;
  isCreatingSubtaskRequest: boolean;
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
  handleCancelCreateSubtask,
  handleCreateSubtask,
  isCreatingSubtaskRequest,
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
          isSelected && !task.completed
            ? "bg-surface-elevated"
            : !task.completed
              ? "bg-surface/50 hover:bg-surface/90"
              : ""
        }
      `}
      style={
        subtasks.length > 0 && isSelected
          ? { borderColor: accentColor }
          : { borderColor: "var(--color-border)" }
      }
    >
      <div
        onClick={(event) => {
          event.stopPropagation();
          onSelect(task);
        }}
        className={`
          relative group flex flex-col px-2.5 py-1.5 transition-colors 
          ${
            subtasks.length === 0 ? "border" : openSubtasks ? "border-b" : ""
          } ${isTaskSelected && !task.completed ? "bg-surface-elevated" : !task.completed ? "hover:bg-surface/20" : ""}
          } ${task.completed ? "opacity-30 bg-muted/20" : ""}`}
        style={
          isTaskSelected
            ? { borderColor: accentColor }
            : { borderColor: "var(--color-border)" }
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
              aria-label={`Adicionar subtarefa`}
              title="Adicionar subtarefa"
              onClick={(event) => {
                event.stopPropagation();
                onSelect(task);
                setOpenSubtasks(true);
                onCreateSubtask(task.id);
              }}
              className={`flex shrink-0 cursor-pointer items-center justify-center hover:bg-surface-elevated p-1.5 disabled:cursor-not-allowed disabled:opacity-30 ${!isTaskSelected ? "opacity-20 transition-all group-hover:opacity-100" : ""}`}
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
              className={`flex shrink-0 cursor-pointer items-center justify-center hover:bg-surface-elevated p-2 disabled:cursor-not-allowed disabled:opacity-30 ${!isTaskSelected ? "opacity-20 transition-all group-hover:opacity-100 " : ""}`}
              style={{ color: accentColor }}
            >
              <FileText className="h-5 w-5" />
            </button>
            <div
              className={`${!isTaskSelected ? "opacity-20 transition-all group-hover:opacity-100 " : ""}`}
              onClickCapture={() => onSelect(task)}
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
                className={`pointer-events-none absolute inset-x-[-0.5%] w-[101%] ${task.tags.length > 0 ? "top-[38%]" : "top-1/2"} h-px bg-muted/70`}
              />
            )}
          </div>
        </div>

        {task.tags.length > 0 && <TaskTags tags={task.tags} />}
      </div>

      {subtasks.length > 0 && (
        <button
          title={openSubtasks ? "Ocultar subtarefas" : "Ver subtarefas"}
          aria-expanded={openSubtasks}
          className={`
            cursor-pointer flex justify-center transition-colors
            ${
              isTaskSelected && !openSubtasks && !task.completed
                ? "bg-surface-elevated "
                : !isTaskSelected && !task.completed
                  ? " bg-surface/15 hover:bg-surface/20"
                  : ""
            } 
            ${task.completed ? "opacity-30 bg-muted/20" : ""}
          `}
          onClick={(event) => {
            event.stopPropagation();
            setOpenSubtasks((current) => !current);
          }}
        >
          {openSubtasks ? (
            <ChevronUp className="h-4 w-4 text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted" />
          )}
        </button>
      )}

      {isCreatingSubtask && parentTaskId === task.id && (
        <>
          {subtasks.length === 0 && (
            <ChevronUp className="h-4 w-4 text-muted opacity-30 self-center" />
          )}
          <div
            ref={newSubtaskItemRef}
            className="group flex items-center gap-3 bg-surface/10 px-3 py-2 mx-2 mb-2"
            style={{
              border: `1px solid ${accentColor}`,
            }}
          >
            <div className="h-4 w-4 shrink-0 rounded-full border-2 border-muted opacity-40" />

            <input
              ref={newSubtaskInputRef}
              type="text"
              disabled={isCreatingSubtaskRequest}
              value={newSubtaskTitle}
              onChange={(event) => setNewSubtaskTitle(event.target.value)}
              onKeyDown={handleKeyDownCreatingSubtask}
              placeholder="Nome da tarefa..."
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent p-1 text-xs text-foreground outline-none placeholder:text-subtle focus:border focus:border-border/40"
            />

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                disabled={isCreatingSubtaskRequest || !newSubtaskTitle.trim()}
                onClick={() => void handleCreateSubtask()}
                className="flex cursor-pointer items-center justify-center rounded-sm bg-primary p-1.5 text-xs text-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreatingSubtaskRequest ? "Criando..." : "Criar"}
              </button>

              <button
                type="button"
                disabled={isCreatingSubtaskRequest}
                onClick={handleCancelCreateSubtask}
                className="flex cursor-pointer items-center justify-center rounded-sm bg-danger p-1.5 text-xs text-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
      <AnimatePresence initial={false}>
        <motion.div
          className={` 
          ${
            isTaskSelected && !task.completed
              ? "bg-surface-elevated"
              : !task.completed
                ? "border-border/50 hover:bg-surface/20"
                : ""
          } ${task.completed ? "opacity-30 bg-muted/20" : ""}`}
        >
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
                    relative group z-10 flex items-center gap-3 border border-foreground/10 px-3 py-1.5 transition-colors mx-2 mb-2 
                    ${
                      isSubtaskSelected && !subtask.completed
                        ? "bg-surface-elevated"
                        : !subtask.completed
                          ? "border-border/50 hover:bg-surface/20"
                          : ""
                    } ${subtask.completed ? "opacity-50 bg-muted/30" : ""}`}
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
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
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
                      className={`flex shrink-0 cursor-pointer items-center justify-center hover:bg-surface-elevated p-2 disabled:cursor-not-allowed disabled:opacity-50 ${!isSubtaskSelected ? "opacity-20 transition-all group-hover:opacity-100 " : ""}`}
                      style={{ color: accentColor }}
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                    <div
                      className={`${!isSubtaskSelected ? "opacity-20 transition-all group-hover:opacity-100 " : ""}`}
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
                    <div className="pointer-events-none absolute inset-x-[-0.5%] top-1/2 w-[101%] h-px bg-muted/70" />
                  )}
                </motion.div>
              );
            })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
