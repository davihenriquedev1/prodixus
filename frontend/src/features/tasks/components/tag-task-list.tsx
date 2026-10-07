"use client";

import { ListTodo } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteTask,
  getTagTasks,
  updateTask,
} from "@/features/tasks/services/task.service";
import type { Task } from "@/features/tasks/types/task";
import { TagTaskItem } from "./tag-task-item";
import { ActionConfirm } from "@/components/ui/action-confirm";
import { getProjects } from "@/features/projects/services/project.service";
import type { Project } from "@/features/projects/types/project";
interface TagTaskListProps {
  tagId: string;
  color: string;
  selectedTask: Task | null;
  onSelectTask: (task: Task) => void;
  onClearSelectedTask: () => void;
  onOpenDetails: (task: Task) => void;
  onTaskUpdated: (task: Task) => void;
  updatedTask: Task | null;
}

export function TagTaskList({
  tagId,
  color,
  selectedTask,
  onSelectTask,
  onClearSelectedTask,
  onOpenDetails,
  onTaskUpdated,
  updatedTask,
}: TagTaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [actionTask, setActionTask] = useState<Task | null>(null);
  const [actionConfirmType, setActionConfirmType] = useState<
    "archive" | "delete" | null
  >(null);

  const errorColor = "#EF4444";

  useEffect(() => {
    async function loadTasks() {
      try {
        setError(false);
        setIsLoading(true);

        const [tasksData, projectsData] = await Promise.all([
          getTagTasks(tagId),
          getProjects(),
        ]);

        setTasks(tasksData.filter((task) => !task.archived));
        setProjects(projectsData);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    void loadTasks();
  }, [tagId]);

  async function handleTitleUpdate(task: Task, title: string) {
    const normalizedTitle = title.trim();

    if (!normalizedTitle || normalizedTitle === task.title) {
      return;
    }

    if (pendingTaskId === task.id) {
      return;
    }

    setPendingTaskId(task.id);

    try {
      const updatedTask = await updateTask(task.projectId, task.id, {
        title: normalizedTitle,
      });

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id ? updatedTask : currentTask,
        ),
      );

      onTaskUpdated(updatedTask);
    } catch {
      toast.error("Não foi possível atualizar o título da tarefa.");
    } finally {
      setPendingTaskId(null);
    }
  }

  async function handleCompletionToggle(task: Task) {
    if (pendingTaskId === task.id) {
      return;
    }

    setPendingTaskId(task.id);

    try {
      const updatedTask = await updateTask(task.projectId, task.id, {
        completed: !task.completed,
      });

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id ? updatedTask : currentTask,
        ),
      );

      onTaskUpdated(updatedTask);
    } catch {
      toast.error("Não foi possível atualizar a tarefa.");
    } finally {
      setPendingTaskId(null);
    }
  }

  function handleArchiveTask(task: Task) {
    setActionTask(task);
    setActionConfirmType("archive");
  }

  function handleDeleteTask(task: Task) {
    setActionTask(task);
    setActionConfirmType("delete");
  }

  async function handleConfirmAction() {
    if (!actionTask || !actionConfirmType) {
      return;
    }

    if (pendingTaskId === actionTask.id) {
      return;
    }

    setPendingTaskId(actionTask.id);

    try {
      if (actionConfirmType === "archive") {
        await updateTask(actionTask.projectId, actionTask.id, {
          archived: true,
        });
      }

      if (actionConfirmType === "delete") {
        await deleteTask(actionTask.projectId, actionTask.id);
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== actionTask.id),
      );

      if (selectedTask?.id === actionTask.id) {
        onClearSelectedTask();
      }

      setActionTask(null);
      setActionConfirmType(null);
    } catch {
      toast.error(
        actionConfirmType === "archive"
          ? "Não foi possível arquivar a tarefa."
          : "Não foi possível excluir a tarefa.",
      );
    } finally {
      setPendingTaskId(null);
    }
  }

  useEffect(() => {
    if (!updatedTask) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );
  }, [updatedTask]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        Carregando tarefas...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center gap-2 py-4 text-sm"
        style={{ color: color }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: errorColor }}
        />
        Não foi possível carregar as tarefas.
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <ListTodo className="h-5 w-5" style={{ color: color }} />

        <p className="text-sm text-slate-500">
          Nenhuma tarefa possui esta tag.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {tasks.map((task) => {
          const project = projects.find(
            (project) => project.id === task.projectId,
          );

          return (
            <TagTaskItem
              key={task.id}
              task={task}
              project={project ?? null}
              selectedTask={selectedTask}
              color={color}
              pendingTaskId={pendingTaskId}
              onSelect={onSelectTask}
              onCompletionToggle={handleCompletionToggle}
              onArchive={handleArchiveTask}
              onDelete={handleDeleteTask}
              onOpenDetails={onOpenDetails}
              onTitleUpdate={handleTitleUpdate}
            />
          );
        })}
      </div>

      <ActionConfirm
        open={actionTask !== null && actionConfirmType !== null}
        title={
          actionConfirmType === "archive" ? "Arquivar tarefa" : "Excluir tarefa"
        }
        message="Tem certeza que deseja"
        confirmLabel={actionConfirmType === "archive" ? "Arquivar" : "Excluir"}
        itemName={actionTask?.title ?? ""}
        onClose={() => {
          setActionTask(null);
          setActionConfirmType(null);
        }}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}
