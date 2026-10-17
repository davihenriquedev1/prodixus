import { Dispatch, SetStateAction } from "react";
import { ArrowLeft, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export function SettingsHeader({
  sidebarOpen,
  setSidebarOpen,
}: SettingsHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={`h-13.25 border-b px-3.5 border-border/60 flex items-center ${sidebarOpen ? "justify-end" : "justify-between"} sticky top-0 z-10 bg-background`}
    >
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className={`${sidebarOpen ? "hidden" : "flex"} cursor-pointer`}
        aria-label={"Abrir configurações"}
      >
        <Settings className="size-6 text-muted" />
      </button>
      <button
        type="button"
        onClick={() => {
          const lastRoute = sessionStorage.getItem("settings:returnTo");

          if (
            lastRoute?.startsWith("/tasks") ||
            lastRoute?.startsWith("/tags")
          ) {
            router.push(lastRoute);
            return;
          }

          router.push("/dashboard");
        }}
        className="flex cursor-pointer gap-2 rounded-lg py-2 text-xs text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>
    </header>
  );
}
