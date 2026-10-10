"use client";

import { ListTodo } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTagTasks } from "@/features/tasks/hooks/use-tasks";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useTaskMutations } from "@/features/tasks/hooks/use-task-mutations";
import type { Task } from "@/features/tasks/types/task";
import { TagTaskItem } from "./tag-task-item";
import { ActionConfirm } from "@/components/ui/action-confirm";

interface TagTaskListProps {
  tagId: string;
  color: string;
  selectedTask: Task | null;
  onSelectTask: (task: Task) => void;
  onClearSelectedTask: () => void;
  onOpenDetails: (task: Task) => void;
  onTaskUpdated: (task: Task) => void;
}

export function TagTaskList({
  tagId,
  color,
  selectedTask,
  onSelectTask,
  onClearSelectedTask,
  onOpenDetails,
  onTaskUpdated,
}: TagTaskListProps) {
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [actionTask, setActionTask] = useState<Task | null>(null);
  const [actionConfirmType, setActionConfirmType] = useState<
    "archive" | "delete" | null
  >(null);

  const errorColor = "#EF4444";

  const {
    data: tagTasks = [],
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useTagTasks(tagId);

  const {
    data: projects = [],
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useProjects();

  const { updateTaskMutation, deleteTaskMutation } = useTaskMutations();

  const tasks = tagTasks.filter((task) => !task.archived);
  const isLoading = isTasksLoading || isProjectsLoading;
  const error = isTasksError || isProjectsError;

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
      const updatedTask = await updateTaskMutation.mutateAsync({
        projectId: task.projectId,
        taskId: task.id,
        data: { title: normalizedTitle },
      });

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
      const updatedTask = await updateTaskMutation.mutateAsync({
        projectId: task.projectId,
        taskId: task.id,
        data: { completed: !task.completed },
      });

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
        await updateTaskMutation.mutateAsync({
          projectId: actionTask.projectId,
          taskId: actionTask.id,
          data: { archived: true },
        });
      }

      if (actionConfirmType === "delete") {
        await deleteTaskMutation.mutateAsync({
          projectId: actionTask.projectId,
          taskId: actionTask.id,
        });
      }

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
