"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addTagToTask,
  createTask,
  deleteTask,
  removeTagFromTask,
  updateTask,
} from "@/features/tasks/services/task.service";
import { taskQueryKeys } from "./task.query-keys";
import { dashboardQueryKeys } from "@/features/dashboard/hooks/dashboard-query-keys";

export function useTaskMutations() {
  const queryClient = useQueryClient();

  const invalidateTasks = async (projectId: string) => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.project(projectId),
      }),
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      }),
      queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.all,
      }),
    ]);
  };

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: async (task) => {
      await invalidateTasks(task.projectId);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({
      projectId,
      taskId,
      data,
    }: {
      projectId: string;
      taskId: string;
      data: Parameters<typeof updateTask>[2];
    }) => updateTask(projectId, taskId, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
      await queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.all,
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: ({
      projectId,
      taskId,
    }: {
      projectId: string;
      taskId: string;
    }) => deleteTask(projectId, taskId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
      await queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.all,
      });
    },
  });

  const addTagToTaskMutation = useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      addTagToTask(taskId, tagId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
      await queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.all,
      });
    },
  });

  const removeTagFromTaskMutation = useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      removeTagFromTask(taskId, tagId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
      await queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.all,
      });
    },
  });

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    removeTagFromTaskMutation,
    addTagToTaskMutation,
  };
}
