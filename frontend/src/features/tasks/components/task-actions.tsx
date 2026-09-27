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

interface TaskActionsProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onEdit: () => void;
  onCompletionToggle: () => void;
  taskCompleted: boolean;
  onArchive: () => void;
  onDelete: () => void;
  size: number;
  color: string;
}

export function TaskActions({
  onEdit,
  onCompletionToggle,
  taskCompleted,
  onArchive,
  onDelete,
  color,
  size,
}: TaskActionsProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

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

    const menuWidth = 176;
    const menuHeight = 160;
    const gap = 4;

    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    const spaceBottom = window.innerHeight - rect.top;
    const spaceTop = rect.bottom;

    const left =
      spaceRight >= menuWidth + gap
        ? rect.right + gap
        : rect.left - menuWidth - gap;

    const top =
      spaceBottom >= menuHeight + gap ? rect.top : rect.bottom - menuHeight;

    setMenuPosition({
      top: Math.max(gap, top),
      left: Math.max(gap, Math.min(left, window.innerWidth - menuWidth - gap)),
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
        className="cursor-pointer p-1.5 text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"
        aria-label="Ações da tarefa"
        style={{ color: color }}
        onClick={(event) => {
          event.stopPropagation();
          toggleMenu();
        }}
      >
        <MoreHorizontal
          className={`${!size ? "h-3.5 w-3.5" : `h-${size} w-${size}`}`}
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
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleEdit}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800/60"
          >
            <Pencil className="h-3.5 w-3.5 text-slate-500" />
            Editar Tarefa
          </button>

          <button
            type="button"
            onClick={handleCompletionToggle}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800/60"
          >
            {taskCompleted ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                Reabrir Tarefa
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-slate-500" />
                Concluir Tarefa
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleArchive}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800/60"
          >
            <Archive className="h-3.5 w-3.5 text-slate-500" />
            Arquivar Tarefa
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Excluir Tarefa
          </button>
        </div>
      )}
    </>
  );
}
