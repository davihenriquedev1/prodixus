"use client";

import {
  FolderPlus,
  MoreHorizontal,
  Pencil,
  SquarePlus,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FolderActionsProps {
  onCreateFolder: () => void;
  onCreateProject: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function FolderActions({
  onCreateFolder,
  onCreateProject,
  onEdit,
  onDelete,
}: FolderActionsProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        !buttonRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function toggleMenu() {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setMenuPosition({
      top: rect.top,
      left: rect.right + 4,
    });

    setOpen((value) => !value);
  }

  function handleCreateFolder() {
    setOpen(false);
    onCreateFolder();
  }

  function handleCreateProject() {
    setOpen(false);
    onCreateProject();
  }

  function handleEdit() {
    setOpen(false);
    onEdit();
  }

  function handleDelete() {
    setOpen(false);
    onDelete();
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="p-1.5 hover:bg-slate-800/60 text-slate-500 cursor-pointer hover:text-slate-300"
        aria-label="Folder actions"
        onClick={toggleMenu}
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="fixed z-100 w-44 rounded-md border border-slate-800 bg-[#0D0F14] p-1 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <button
            type="button"
            onClick={handleCreateFolder}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 cursor-pointer hover:bg-slate-800/60"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            <span>Nova subpasta</span>
          </button>

          <button
            type="button"
            onClick={handleCreateProject}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 cursor-pointer hover:bg-slate-800/60"
          >
            <SquarePlus className="h-3.5 w-3.5" />
            <span>Novo projeto</span>
          </button>

          <button
            type="button"
            onClick={handleEdit}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 cursor-pointer hover:bg-slate-800/60"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Editar pasta</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-red-400 cursor-pointer hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Excluir pasta</span>
          </button>
        </div>
      )}
    </>
  );
}
