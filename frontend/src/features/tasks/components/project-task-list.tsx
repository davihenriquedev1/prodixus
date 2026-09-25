"use client";

import { ListTodo } from "lucide-react";
import { useEffect, useState } from "react";

import { getProjectTasks } from "@/features/tasks/services/task.service";
import type { Task } from "@/features/tasks/types/task";
import { ProjectTaskItem } from "./project-task-item";

interface ProjectTaskListProps {
  projectId: string;
  primaryColor: string;
  accentColor: string;
  errorColor: string;
  onCompletionToggle: (task: Task) => Promise<Task>;
  onOpenDetails: (task: Task) => void;
}

export function ProjectTaskList({
  projectId,
  primaryColor,
  accentColor,
  errorColor,
  onCompletionToggle,
  onOpenDetails,
}: ProjectTaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  async function handleCompletionToggle(task: Task) {
    const updatedTask = await onCompletionToggle(task);

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === updatedTask.id ? updatedTask : currentTask,
      ),
    );
  }
  function onAddNewSubtask(task: Task) {
    return task;
  }

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

    loadTasks();
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

  if (tasks.length === 0) {
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
    <div className="space-y-1">
      {tasks.map((task) => (
        <ProjectTaskItem
          key={task.id}
          task={task}
          primaryColor={primaryColor}
          accentColor={accentColor}
          onCompletionToggle={handleCompletionToggle}
          onOpenDetails={onOpenDetails}
          onAddNewSubtask={onAddNewSubtask}
        />
      ))}
    </div>
  );
}
