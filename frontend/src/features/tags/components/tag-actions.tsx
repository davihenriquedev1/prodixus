"use client";

import { getMenuPosition } from "@/utils/get-menu-position";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";

interface TagActionsProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onEdit: () => void;
  onDelete: () => void;
  size?: number;
}

export function TagActions({ onEdit, onDelete, size }: TagActionsProps) {
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
        className="group cursor-pointer text-subtle"
        aria-label="Ações da tag"
        title="Ações da tag"
        onClick={handleToggleActions}
      >
        <MoreHorizontal
          className={`${!size ? "w-3.5 h-3.5" : `w-${size} h-${size}`} group-hover:text-foreground`}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="fixed z-100 w-44 rounded-md border border-border bg-surface-elevated p-1 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <button
            type="button"
            onClick={handleEdit}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 cursor-pointer text-left text-xs text-foreground hover:bg-surface"
          >
            <Pencil className="h-3.5 w-3.5 text-muted" />
            Editar Tag
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 cursor-pointer text-left text-xs text-danger hover:bg-danger/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Excluir Tag
          </button>
        </div>
      )}
    </>
  );
}
