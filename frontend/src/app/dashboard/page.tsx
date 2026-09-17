import { AppShell } from "@/components/app-shell";
import { DashboardGreeting } from "@/features/dashboard/components/dashboard-greeting";
import { DashboardMetrics } from "@/features/dashboard/components/dashboard-metrics";
import { ProjectsOverview } from "@/features/dashboard/components/projects-overview";
import { RecentTasks } from "@/features/dashboard/components/recent-tasks";

export default function DashboardPage() {
  return (
    <AppShell>
      <main className="p-8 max-w-6xl w-full mx-auto space-y-8">
        <DashboardGreeting />
        <DashboardMetrics />
        <ProjectsOverview />
        <RecentTasks />
      </main>
    </AppShell>
  );
}
