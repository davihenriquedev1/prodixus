"use client";

import { useAuth } from "@/features/auth/context/auth.context";
import {
  Bell,
  Search,
  User2Icon,
  Settings,
  LogOut,
  SidebarOpen,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-surface/50 px-3.5 h-13.25 backdrop-blur-md shrink-0">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className={`${sidebarOpen ? "hidden" : "flex"} items-center shrink-0 cursor-pointer transition`}
          title="Abrir barra lateral"
          aria-label="Abrir barra lateral"
          onClick={() => setSidebarOpen(true)}
        >
          <SidebarOpen className="size-6 text-primary" />
        </div>
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-subtle" />

          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            className="w-full rounded-lg border border-border/80 bg-surface-elevated/60 py-1.5 pl-9 pr-12 text-xs text-foreground transition placeholder:text-subtle focus:border-subtle focus:outline-none focus:ring-1 focus:ring-border"
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border/60 px-1.5 py-0.5 font-mono text-[10px] text-subtle">
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative cursor-pointer rounded-full text-muted hover:text-foreground"
        >
          <Bell className="h-5.5 w-5.5" />
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label="User menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex cursor-pointer items-center justify-center rounded-full text-muted transition hover:text-foreground"
          >
            <User2Icon className="h-6 w-6" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-54 overflow-hidden rounded-xl border border-border bg-surface-elevated p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/settings/me");
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted transition hover:bg-surface hover:text-foreground"
              >
                <Settings className="h-4 w-4 text-subtle" />
                Configurações da conta
              </button>

              <div className="my-1 border-t border-border" />

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger transition hover:bg-danger/10 hover:text-danger"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
