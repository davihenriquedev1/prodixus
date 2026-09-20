"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/services/project.service";
import { getProjectTasks } from "@/services/task.service";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

interface DashboardData {
  projects: Project[];
  tasks: Task[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    projects: [],
    tasks: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const projects = await getProjects();

        const projectTasks = await Promise.all(
          projects.map((project) => getProjectTasks(project.id)),
        );

        setData({
          projects,
          tasks: projectTasks.flat(),
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
