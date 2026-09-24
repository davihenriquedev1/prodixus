"use client";

import { FolderPlus, Plus, SquarePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="text-slate-500 cursor-pointer hover:text-slate-300"
        aria-label="Create"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="fixed z-100 w-40 rounded-md border border-slate-800 bg-[#0D0F14] p-1 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <button
            type="button"
            onClick={handleCreateFolder}
            className="w-full flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 cursor-pointer hover:bg-slate-800/60"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Nova pasta</span>
          </button>

          <button
            type="button"
            onClick={handleCreateProject}
            className="w-full flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 cursor-pointer hover:bg-slate-800/60"
          >
            <SquarePlus className="w-3.5 h-3.5" />
            <span>Novo projeto</span>
          </button>
        </div>
      )}
    </>
  );
}
