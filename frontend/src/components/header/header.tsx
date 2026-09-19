"use client";
import { useAuth } from "@/features/auth/context/auth.context";

import { Bell, Search } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b border-slate-800/60 px-8 py-2 flex items-center justify-between bg-[#0D0F14]/50 backdrop-blur-md sticky top-0 z-10">
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-slate-900/60 border border-slate-800/80 rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-700 transition"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono border border-slate-700/60 rounded px-1.5 py-0.5">
          ⌘K
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/40">
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 border-l border-slate-800 pl-4">
          <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
            <span className="text-xs font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          <span className="text-xs font-medium text-slate-200">
            {user?.name.split(" ")[0]}
          </span>

          <button
            type="button"
            onClick={logout}
            className="text-xs text-slate-500 transition hover:text-slate-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
