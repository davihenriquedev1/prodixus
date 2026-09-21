"use client";

import { MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FolderActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function FolderActions({ onEdit, onDelete }: FolderActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  function handleEdit() {
    setOpen(false);
    onEdit();
  }

  function handleDelete() {
    setOpen(false);
    onDelete();
  }

  return (
    <div ref={menuRef} className="relative group">
      <button
        type="button"
        className="p-1 rounded hover:bg-slate-800/60 text-slate-500 hover:text-slate-300"
        aria-label="Folder actions"
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 w-40 rounded-md border border-slate-800 bg-[#0D0F14] p-1 shadow-lg">
          <button
            type="button"
            onClick={handleEdit}
            className="w-full rounded px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800/60"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-full rounded px-2 py-1.5 text-left text-xs text-red-400 hover:bg-red-500/10"
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}
