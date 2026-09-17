"use client";

import { Home, MoreHorizontal, Plus, Settings } from "lucide-react";
import { FolderTree } from "@/components/sidebar/projects/folder-tree";
import { TagItem } from "@/components/sidebar/tags/tag-item";
import type { Folder } from "@/types/folder";
import type { Project } from "@/types/project";

const folders: Folder[] = [
  {
    id: "folder-1",
    name: "Pasta 1",
    parentId: null,
    userId: "user-1",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "folder-2",
    name: "Pasta 2",
    parentId: "folder-1",
    userId: "user-1",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "folder-3",
    name: "Sub Pasta 1",
    parentId: "folder-1",
    userId: "user-1",
    createdAt: "",
    updatedAt: "",
  },
];

const projects: Project[] = [
  {
    id: "project-1",
    name: "Projeto Q",
    notes: null,
    completed: false,
    archived: false,
    estimatedDuration: null,
    dueAt: null,
    primaryColor: null,
    accentColor: null,
    errorColor: null,
    userId: "user-1",
    createdAt: "",
    updatedAt: "",
    folderId: "folder-2",
  },
  {
    id: "project-2",
    name: "Projeto 1",
    notes: null,
    completed: false,
    archived: false,
    estimatedDuration: null,
    dueAt: null,
    primaryColor: null,
    accentColor: null,
    errorColor: null,
    userId: "user-1",
    createdAt: "",
    updatedAt: "",
    folderId: "folder-3",
  },
  {
    id: "project-3",
    name: "Projeto 2",
    notes: null,
    completed: false,
    archived: false,
    estimatedDuration: null,
    dueAt: null,
    primaryColor: null,
    accentColor: null,
    errorColor: null,
    userId: "user-1",
    createdAt: "",
    updatedAt: "",
    folderId: "folder-3",
  },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800/60 bg-[#0D0F14]/80 backdrop-blur-xl flex flex-col justify-between z-10">
      <div className="p-4 space-y-6 overflow-y-auto">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center">
            <div className="w-2 h-2 bg-slate-200 rounded-sm" />
          </div>

          <span className="font-bold tracking-wider text-sm text-slate-100 uppercase">
            Prodixus
          </span>
        </div>

        <nav>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-slate-800/50 text-slate-100 border border-slate-700/50">
            <Home className="w-4 h-4" />
            <span>Início</span>
          </button>
        </nav>

        <section className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Projetos
            </span>

            <div className="flex items-center gap-1 text-slate-500">
              <button className="hover:text-slate-300 p-0.5 rounded">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              <button className="hover:text-slate-300 p-0.5 rounded">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-xs">
            <FolderTree folders={folders} projects={projects} />
          </div>
        </section>

        <section className="space-y-2">
          <div className="px-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Tags
          </div>

          <div className="space-y-1 text-xs">
            <TagItem name="Urgent" color="red" />
            <TagItem name="In Progress" color="yellow" />
            <TagItem name="Blocked" color="gray" />
          </div>
        </section>
      </div>

      <div className="p-3 border-t border-slate-800/60">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
          <Settings className="w-4 h-4" />
          <span>Configurações</span>
        </button>
      </div>
    </aside>
  );
}
