"use client";

import { ListTodo, MoreHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import {
  createTask,
  deleteTask,
  getProjectTasks,
  updateTask,
} from "@/features/tasks/services/task.service";
import type { Task } from "@/features/tasks/types/task";
import { ProjectTaskItem } from "./project-task-item";
import { ActionConfirm } from "@/components/ui/action-confirm";

interface ProjectTaskListProps {
  projectId: string;
  primaryColor: string;
  accentColor: string;
  errorColor: string;
  isCreatingTask: boolean;
  selectedTask: Task | null;
  onSelectTask: (task: Task) => void;
  onClearSelectedTask: () => void;
  onOpenDetails: (task: Task) => void;
  onCreatingTaskChange: (value: boolean) => void;
}

export function ProjectTaskList({
  projectId,
  primaryColor,
  accentColor,
  errorColor,
  isCreatingTask,
  selectedTask,
  onSelectTask,
  onClearSelectedTask,
  onOpenDetails,
  onCreatingTaskChange,
}: ProjectTaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [actionTask, setActionTask] = useState<Task | null>(null);
  const [actionType, setActionType] = useState<"archive" | "delete" | null>(
    null,
  );

  const newTaskInputRef = useRef<HTMLInputElement>(null);
  const newTaskItemRef = useRef<HTMLDivElement>(null);

  async function handleCompletionToggle(task: Task) {
    const updatedTask = await updateTask(task.projectId, task.id, {
      completed: !task.completed,
    });

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === updatedTask.id ? updatedTask : currentTask,
      ),
    );
  }

  function handleArchiveTask(task: Task) {
    setActionTask(task);
    setActionType("archive");
  }

  function handleDeleteTask(task: Task) {
    setActionTask(task);
    setActionType("delete");
  }

  async function handleCreateTask() {
    const title = newTaskTitle.trim();

    if (!title) {
      return;
    }

    const newTask = await createTask({
      title,
      projectId,
    });

    setTasks((currentTasks) => [...currentTasks, newTask]);

    setNewTaskTitle("");
    onCreatingTaskChange(false);
  }

  const handleCancelCreateTask = useCallback(() => {
    setNewTaskTitle("");
    onCreatingTaskChange(false);
  }, [onCreatingTaskChange]);

  function handleKeyDownCreating(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      void handleCreateTask();
    }

    if (event.key === "Escape") {
      handleCancelCreateTask();
    }
  }

  async function handleConfirmAction() {
    if (!actionTask || !actionType) {
      return;
    }

    if (actionType === "archive") {
      const updatedTask = await updateTask(
        actionTask.projectId,
        actionTask.id,
        { archived: true },
      );

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== updatedTask.id),
      );
    }

    if (actionType === "delete") {
      await deleteTask(actionTask.projectId, actionTask.id);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== actionTask.id),
      );
    }

    if (selectedTask?.id === actionTask.id) {
      onClearSelectedTask();
    }

    setActionTask(null);
    setActionType(null);
  }

  useEffect(() => {
    if (!isCreatingTask) {
      return;
    }

    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node;

      if (newTaskItemRef.current && !newTaskItemRef.current.contains(target)) {
        handleCancelCreateTask();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleCancelCreateTask, isCreatingTask]);

  useEffect(() => {
    async function loadTasks() {
      try {
        setError(false);
        setIsLoading(true);

        const data = await getProjectTasks(projectId);

        setTasks(data);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    void loadTasks();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: primaryColor }}
        />
        Carregando tarefas...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center gap-2 py-4 text-sm"
        style={{ color: errorColor }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: errorColor }}
        />
        Não foi possível carregar as tarefas.
      </div>
    );
  }

  if (tasks.length === 0 && !isCreatingTask) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <ListTodo className="h-5 w-5" style={{ color: accentColor }} />

        <p className="text-sm text-slate-500">Nenhuma tarefa neste projeto.</p>

        <p className="text-xs text-slate-600">
          Crie uma nova tarefa para começar.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-1">
        <AnimatePresence>
          {isCreatingTask && (
            <motion.div
              ref={newTaskItemRef}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="group flex items-center gap-3 bg-slate-800/10 px-3 py-2"
              style={{
                border: `1px solid ${accentColor}`,
              }}
            >
              <div className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-500 opacity-40" />

              <input
                ref={newTaskInputRef}
                type="text"
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                onKeyDown={handleKeyDownCreating}
                placeholder="Nome da tarefa..."
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent p-1 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border focus:border-slate-600/40"
              />

              <div className="flex items-center">
                <div className="flex shrink-0 items-center justify-center p-1.5">
                  <MoreHorizontal className="h-6 w-6 text-slate-500/30" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {tasks.map((task) => (
          <ProjectTaskItem
            key={task.id}
            task={task}
            isSelected={selectedTask?.id === task.id}
            onSelect={onSelectTask}
            primaryColor={primaryColor}
            accentColor={accentColor}
            onCompletionToggle={handleCompletionToggle}
            onArchive={handleArchiveTask}
            onDelete={handleDeleteTask}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
      <ActionConfirm
        open={actionTask !== null && actionType !== null}
        title={actionType === "archive" ? "Arquivar tarefa" : "Excluir tarefa"}
        message={
          actionType === "archive"
            ? "Tem certeza que deseja arquivar"
            : "Tem certeza que deseja excluir"
        }
        confirmLabel={actionType === "archive" ? "Arquivar" : "Excluir"}
        itemName={actionTask?.title ?? ""}
        onClose={() => {
          setActionTask(null);
          setActionType(null);
        }}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}
