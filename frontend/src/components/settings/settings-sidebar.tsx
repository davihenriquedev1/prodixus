"use client";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Settings,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

const settingsItems = [
  {
    label: "Preferências",
    href: "/settings/preferences",
    icon: SlidersHorizontal,
  },
  {
    label: "Configurações da Conta",
    href: "/settings/me",
    icon: UserRound,
  },
];

interface SettingsSidebarProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  switchRoute: () => void;
}

export function SettingsSidebar({
  open,
  setOpen,
  switchRoute,
}: SettingsSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={`absolute left-0 top-0 z-100 flex h-full shrink-0 flex-col border-r border-border/60 bg-surface transition-all duration-300 md:relative ${
        open
          ? "visible w-72 min-w-72"
          : "invisible w-0 min-w-0 border-r-0 overflow-hidden"
      }`}
    >
      <div className="flex items-center justify-between border-b border-border/60 px-3.5 h-13.25">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-xl border border-border/60 bg-surface-elevated/50 p-2">
            <Settings className="h-4 w-4 text-muted" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              Configurações
            </h1>
            <p className="text-[11px] text-subtle">
              Gerencie sua conta e workspace
            </p>
          </div>
        </div>

        <div
          className="flex cursor-pointer hover:bg-surface-elevated"
          onClick={() => setOpen(false)}
        >
          <ChevronLeft className="size-6" />
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3.5">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 text-xs transition ${
                isActive
                  ? "rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-foreground"
                  : "border-b border-border/40 px-3.25 py-2.75 text-muted hover:bg-surface-elevated/40 hover:text-foreground"
              }`}
              onClick={switchRoute}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>

              {isActive && <ChevronRight className="h-3.5 w-3.5 text-subtle" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-3">
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
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted transition hover:bg-surface-elevated/40 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
      </div>
    </aside>
  );
}
