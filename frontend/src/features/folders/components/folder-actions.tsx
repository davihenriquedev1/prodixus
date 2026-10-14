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
        className="cursor-pointer rounded p-1.5 text-subtle transition-colors hover:bg-surface-elevated hover:text-foreground"
        aria-label="Folder actions"
        aria-expanded={open}
        onClick={toggleMenu}
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="animate-in fade-in-0 zoom-in-95 fixed z-100 w-44 rounded-md border border-border bg-surface-elevated p-1 shadow-xl duration-150"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <button
            type="button"
            onClick={handleCreateFolder}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-surface"
          >
            <FolderPlus className="h-3.5 w-3.5 text-muted" />
            <span>Nova subpasta</span>
          </button>

          <button
            type="button"
            onClick={handleCreateProject}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-surface"
          >
            <SquarePlus className="h-3.5 w-3.5 text-muted" />
            <span>Novo projeto</span>
          </button>

          <button
            type="button"
            onClick={handleEdit}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-surface"
          >
            <Pencil className="h-3.5 w-3.5 text-muted" />
            <span>Editar pasta</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-danger transition-colors hover:bg-danger/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Excluir pasta</span>
          </button>
        </div>
      )}
    </>
  );
}
