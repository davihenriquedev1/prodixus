"use client";

import {
  Archive,
  CheckCircle,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";

interface ProjectActionsProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onEdit: () => void;
  onCompletionToggle: () => void;
  projectCompleted: boolean;
  onArchive: () => void;
  onDelete: () => void;
  size: number;
}

export function ProjectActions({
  onEdit,
  onCompletionToggle,
  projectCompleted,
  onArchive,
  onDelete,
  size,
}: ProjectActionsProps) {
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

  function handleEdit() {
    setOpen(false);
    onEdit();
  }

  function handleDelete() {
    setOpen(false);
    onDelete();
  }

  function handleCompletionToggle() {
    setOpen(false);
    onCompletionToggle();
  }

  function handleArchive() {
    setOpen(false);
    onArchive();
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="p-1.5 cursor-pointer hover:bg-slate-800/60 text-slate-500 hover:text-slate-300"
        aria-label="Ações do projeto"
        onClick={toggleMenu}
      >
        <MoreHorizontal
          className={`${!size ? "w-3.5 h-3.5" : `w-${size} h-${size}`}`}
        />
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
            onClick={handleEdit}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 cursor-pointer text-left text-xs text-slate-300 hover:bg-slate-800/60"
          >
            <Pencil className="h-3.5 w-3.5 text-slate-500" />
            Editar Projeto
          </button>

          <button
            type="button"
            onClick={handleCompletionToggle}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs cursor-pointer text-slate-300 hover:bg-slate-800/60"
          >
            {projectCompleted ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                Reabrir Projeto
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-slate-500" />
                Concluir Projeto
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleArchive}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 cursor-pointer hover:bg-slate-800/60"
          >
            <Archive className="h-3.5 w-3.5 text-slate-500" />
            Arquivar Projeto
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs cursor-pointer text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Excluir Projeto
          </button>
        </div>
      )}
    </>
  );
}
