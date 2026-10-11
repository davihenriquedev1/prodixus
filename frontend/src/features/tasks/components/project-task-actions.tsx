"use client";

import type { MovePosition } from "@/types/move-position";
import type { MouseEvent } from "react";
import { getMenuPosition } from "@/utils/get-menu-position";
import {
  Archive,
  CheckCircle,
  FolderOutput,
  LayersArrowUp,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  TagPlus,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProjectTaskActionsProps {
  onEdit: () => void;
  onCompletionToggle: () => void;
  taskCompleted: boolean;
  onMove?: (position: MovePosition) => void;
  onConvertToParent?: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onEditTags?: (position: MovePosition) => void;
  size: number;
  color: string;
  disabled?: boolean;
}

export function ProjectTaskActions({
  onEdit,
  onCompletionToggle,
  taskCompleted,
  onMove,
  onConvertToParent,
  onArchive,
  onDelete,
  onEditTags,
  color,
  size,
  disabled,
}: ProjectTaskActionsProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MovePosition>({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function handleToggleActions(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!buttonRef.current) {
      return;
    }
    const position = getMenuPosition(buttonRef.current, 184, 160, 4);
    setMenuPosition(position);
    setOpen((value) => !value);
  }

  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
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

  useEffect(() => {
    if (disabled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    }
  }, [disabled]);

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

  function handleMove() {
    if (!menuRef.current) {
      return;
    }

    if (!onMove) {
      return;
    }

    const position = getMenuPosition(menuRef.current, 256, 200, 4);

    setOpen(false);
    onMove(position);
  }

  function handleArchive() {
    setOpen(false);
    onArchive();
  }

  function handleConvertToParent() {
    if (!onConvertToParent) return;

    setOpen(false);
    onConvertToParent();
  }

  function handleEditTags() {
    if (!menuRef.current) return;
    if (!onEditTags) return;
    setOpen(false);
    const position = getMenuPosition(menuRef.current, 256, 200, 4);
    onEditTags(position);
  }

  return (
    <>
      <button
        ref={buttonRef}
        disabled={disabled}
        type="button"
        className="cursor-pointer p-1.5 text-slate-500 hover:bg-slate-800/60 hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Ações da tarefa"
        title="Ações da tarefa"
        style={{ color: color }}
        onClick={handleToggleActions}
      >
        <MoreHorizontal
          className={`${!size ? "h-3.5 w-3.5" : `h-${size} w-${size}`}`}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="fixed z-100 w-46 rounded-md border border-slate-800 bg-[#0D0F14] p-1 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
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
            Editar tarefa
          </button>

          <button
            type="button"
            onClick={handleCompletionToggle}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800/60"
          >
            {taskCompleted ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                Reabrir tarefa
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-slate-500" />
                Concluir tarefa
              </>
            )}
          </button>

          {onMove && (
            <button
              type="button"
              onClick={handleMove}
              className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800/60"
            >
              <FolderOutput className="h-3.5 w-3.5 text-slate-500" />
              Mover para outro projeto
            </button>
          )}

          {onConvertToParent && (
            <button
              type="button"
              onClick={handleConvertToParent}
              className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800/60"
            >
              <LayersArrowUp className="h-3.5 w-3.5 text-slate-500" />
              Converter em tarefa pai
            </button>
          )}

          {onEditTags && (
            <button
              type="button"
              onClick={handleEditTags}
              className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800/60"
            >
              <TagPlus className="h-3.5 w-3.5 text-slate-500" />
              Adicionar/remover tags
            </button>
          )}

          <button
            type="button"
            onClick={handleArchive}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800/60"
          >
            <Archive className="h-3.5 w-3.5 text-slate-500" />
            Arquivar tarefa
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Excluir tarefa
          </button>
        </div>
      )}
    </>
  );
}
