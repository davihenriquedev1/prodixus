"use client";

import { getMenuPosition } from "@/utils/get-menu-position";
import {
  Archive,
  CheckCircle,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProjectActionsProps {
  onEdit: () => void;
  onCompletionToggle: () => void;
  projectCompleted: boolean;
  onArchive: () => void;
  onDelete: () => void;
  size?: number;
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

  function handleToggleActions(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!buttonRef.current) {
      return;
    }
    const position = getMenuPosition(buttonRef.current, 176, 160, 4);
    setMenuPosition(position);
    setOpen((value) => !value);
  }

  function handleEdit() {
    console.log("1. handleEdit executado");
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
        className="group cursor-pointer text-subtle"
        aria-label="Ações do projeto"
        onClick={handleToggleActions}
      >
        <MoreHorizontal
          className={`${!size ? "h-3.5 w-3.5" : `w-${size} h-${size}`} group-hover:text-foreground`}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="fixed z-100 w-44 animate-in fade-in-0 zoom-in-95 rounded-md border border-border bg-surface-elevated p-1 shadow-xl duration-150"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <button
            type="button"
            onClick={handleEdit}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-foreground hover:bg-surface"
          >
            <Pencil className="h-3.5 w-3.5 text-muted" />
            Editar Projeto
          </button>

          <button
            type="button"
            onClick={handleCompletionToggle}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-foreground hover:bg-surface"
          >
            {projectCompleted ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 text-muted" />
                Reabrir Projeto
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-muted" />
                Concluir Projeto
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleArchive}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-foreground hover:bg-surface"
          >
            <Archive className="h-3.5 w-3.5 text-muted" />
            Arquivar Projeto
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-danger hover:bg-danger/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Excluir Projeto
          </button>
        </div>
      )}
    </>
  );
}
