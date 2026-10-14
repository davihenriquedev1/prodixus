"use client";

import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/features/projects/services/project.service";
import { getProjectTasks } from "@/features/tasks/services/task.service";
import { dashboardQueryKeys } from "./dashboard-query-keys";

async function fetchDashboardData() {
  const projects = await getProjects();

  const activeProjects = projects.filter(
    (project) => !project.completed && !project.archived,
  );

  const tasksByProject = await Promise.all(
    projects
      .filter((project) => !project.archived)
      .map((project) => getProjectTasks(project.id)),
  );

  const tasks = tasksByProject.flat();

  return {
    activeProjects,
    activeTasks: tasks.filter((task) => !task.completed && !task.archived),
    completedTasks: tasks.filter((task) => task.completed && !task.archived),
    tasks,
  };
}

export function useDashboardData() {
  const { data, isLoading, isError } = useQuery({
    queryKey: dashboardQueryKeys.data(),
    queryFn: fetchDashboardData,
  });

  return {
    activeProjects: data?.activeProjects ?? [],
    activeTasks: data?.activeTasks ?? [],
    completedTasks: data?.completedTasks ?? [],
    tasks: data?.tasks ?? [],
    isLoading,
    error: isError,
  };
}
