"use client";

import { AppShell } from "@/components/app-shell";
import { ProtectedRoute } from "@/features/auth/components/protected-routes";
import { DashboardGreeting } from "@/features/dashboard/components/dashboard-greeting";
import { DashboardMetrics } from "@/features/dashboard/components/dashboard-metrics";
import { ProjectsOverview } from "@/features/dashboard/components/projects-overview";
import { RecentTasks } from "@/features/dashboard/components/recent-tasks";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";

export default function DashboardPage() {
  const dashboardData = useDashboardData();

  return (
    <ProtectedRoute>
      <AppShell>
        <main className="p-8 max-w-6xl w-full mx-auto space-y-8">
          <DashboardGreeting />

          <DashboardMetrics
            projects={dashboardData.projects}
            tasks={dashboardData.tasks}
            isLoading={dashboardData.isLoading}
            error={dashboardData.error}
          />

          <ProjectsOverview
            projects={dashboardData.projects}
            tasks={dashboardData.tasks}
            isLoading={dashboardData.isLoading}
            error={dashboardData.error}
          />

          <RecentTasks
            tasks={dashboardData.tasks}
            isLoading={dashboardData.isLoading}
            error={dashboardData.error}
          />
        </main>
      </AppShell>
    </ProtectedRoute>
  );
}
