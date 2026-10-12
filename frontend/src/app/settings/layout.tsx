import { SettingsShell } from "@/components/settings/settings-shell";
import { ProtectedRoute } from "@/features/auth/components/protected-routes";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <ProtectedRoute>
      <SettingsShell>{children}</SettingsShell>
    </ProtectedRoute>
  );
}
