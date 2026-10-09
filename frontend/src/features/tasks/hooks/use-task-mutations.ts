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

export function useTaskMutations() {
  const queryClient = useQueryClient();

  const invalidateTasks = async (projectId: string) => {
    await queryClient.invalidateQueries({
      queryKey: taskQueryKeys.project(projectId),
    });
  };

  const create = useMutation({
    mutationFn: createTask,
    onSuccess: async (task) => {
      await invalidateTasks(task.projectId);
    },
  });

  const update = useMutation({
    mutationFn: ({
      projectId,
      taskId,
      data,
    }: {
      projectId: string;
      taskId: string;
      data: Parameters<typeof updateTask>[2];
    }) => updateTask(projectId, taskId, data),

    onSuccess: async (task, variables) => {
      await invalidateTasks(variables.projectId);

      if (task.projectId !== variables.projectId) {
        await invalidateTasks(task.projectId);
      }
    },
  });

  const remove = useMutation({
    mutationFn: ({
      projectId,
      taskId,
    }: {
      projectId: string;
      taskId: string;
    }) => deleteTask(projectId, taskId),

    onSuccess: async (_, variables) => {
      await invalidateTasks(variables.projectId);
    },
  });

  const addTag = useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      addTagToTask(taskId, tagId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
    },
  });

  const removeTag = useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      removeTagFromTask(taskId, tagId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      });
    },
  });

  return {
    create,
    update,
    remove,
    addTag,
    removeTag,
  };
}
