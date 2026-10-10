"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskQueryKeys } from "@/features/tasks/hooks/task.query-keys";

import {
  createProject,
  deleteProject,
  updateProject,
} from "@/features/projects/services/project.service";
import { projectQueryKeys } from "./project.query-keys";
import { dashboardQueryKeys } from "@/features/dashboard/hooks/dashboard-query-keys";

export function useProjectMutations() {
  const queryClient = useQueryClient();

  const invalidateProjects = async () => {
    await queryClient.invalidateQueries({
      queryKey: projectQueryKeys.all,
    });
  };

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: invalidateProjects,
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: Parameters<typeof updateProject>[1];
    }) => updateProject(projectId, data),

    onSuccess: async (_, { projectId }) => {
      await Promise.all([
        invalidateProjects(),
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
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: ({ projectId }: { projectId: string }) =>
      deleteProject(projectId),
    onSuccess: invalidateProjects,
  });

  return {
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
  };
}
