"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getProjectTasks,
  getTagTasks,
} from "@/features/tasks/services/task.service";
import { taskQueryKeys } from "./task.query-keys";

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: taskQueryKeys.project(projectId),
    queryFn: () => getProjectTasks(projectId),
    enabled: Boolean(projectId),
  });
}

export function useTagTasks(tagId: string) {
  return useQuery({
    queryKey: taskQueryKeys.tag(tagId),
    queryFn: () => getTagTasks(tagId),
    enabled: Boolean(tagId),
  });
}
