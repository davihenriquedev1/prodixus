"use client";

import { FolderPlus, Plus, SquarePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ProjectsSectionActionsProps {
  onCreateFolder: () => void;
  onCreateProject: () => void;
}

export function ProjectsSectionActions({
  onCreateFolder,
  onCreateProject,
}: ProjectsSectionActionsProps) {
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

    const menuWidth = 160;
    const menuHeight = 76;
    const spacing = 8;

    const left =
      rect.right + menuWidth + spacing <= window.innerWidth
        ? rect.right + 4
        : Math.max(spacing, rect.left - menuWidth - 6);

    const top = Math.min(
      Math.max(spacing, rect.top),
      window.innerHeight - menuHeight - spacing,
    );

    setMenuPosition({ top, left });
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

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="group cursor-pointer text-subtle"
        aria-label="Create"
      >
        <Plus className="h-3.5 w-3.5 group-hover:text-foreground" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="animate-in fade-in-0 zoom-in-95 fixed z-9999 w-40 rounded-md border border-border bg-surface p-1 shadow-xl duration-150"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >
            <button
              type="button"
              onClick={handleCreateFolder}
              className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-muted hover:bg-surface-elevated"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>Nova pasta</span>
            </button>

            <button
              type="button"
              onClick={handleCreateProject}
              className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-muted hover:bg-surface-elevated"
            >
              <SquarePlus className="h-3.5 w-3.5" />
              <span>Novo projeto</span>
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
