"use client";

import {
  ArrowLeft,
  ChevronRight,
  Settings,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const settingsItems = [
  {
    label: "Preferências",
    href: "/settings/preferencies",
    icon: SlidersHorizontal,
  },
  {
    label: "Configurações da Conta",
    href: "/settings/me",
    icon: UserRound,
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-800/60 bg-[#0D0F14]">
      <div className="flex items-center gap-3 border-b border-slate-800/60 p-2">
        <div className="flex p-2 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/50">
          <Settings className="h-4 w-4 text-slate-300" />
        </div>

        <div>
          <h1 className="text-sm font-semibold text-slate-100">
            Configurações
          </h1>
          <p className="text-[11px] text-slate-500">
            Gerencie sua conta e workspace
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3.5 space-y-1">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2  text-xs transition ${
                isActive
                  ? "border border-slate-700/50 bg-slate-800/70 text-slate-100 px-3 py-2.5 rounded-lg"
                  : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 px-3.25 py-2.75 border-b border-slate-800/40"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>

              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800/60 p-3">
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
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 transition hover:bg-slate-800/40 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
      </div>
    </aside>
  );
}
