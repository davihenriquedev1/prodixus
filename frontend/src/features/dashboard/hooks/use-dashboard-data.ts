"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/features/projects/services/project.service";
import { getProjectTasks } from "@/features/tasks/services/task.service";
import type { Project } from "@/features/projects/types/project";
import type { Task } from "@/features/tasks/types/task";

interface DashboardData {
  activeProjects: Project[];
  activeTasks: Task[];
  completedTasks: Task[];
  tasks: Task[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    activeProjects: [],
    activeTasks: [],
    completedTasks: [],
    tasks: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const projects = await getProjects();

        const activeProjects = projects.filter(
          (project) => !project.completed && !project.archived,
        );

        const tasks = await Promise.all(
          projects.map((project) => getProjectTasks(project.id)),
        );

        setData({
          activeProjects: activeProjects,
          activeTasks: tasks
            .flat()
            .filter((task) => !task.completed && !task.archived),
          completedTasks: tasks.flat().filter((task) => task.completed),
          tasks: tasks.flat(),
        });
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return {
    ...data,
    isLoading,
    error,
  };
}
