"use client";

import { FolderPlus, Plus, SquarePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProjectCreateMenuProps {
  onCreateFolder: () => void;
  onCreateProject: () => void;
}

export function ProjectCreateMenu({
  onCreateFolder,
  onCreateProject,
}: ProjectCreateMenuProps) {
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

  function handleCreateFolder() {
    setOpen(false);
    onCreateFolder();
  }

  function handleCreateProject() {
    setOpen(false);
    onCreateProject();
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="p-0.5 rounded text-slate-500 hover:text-slate-300"
        aria-label="Create"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-md border border-slate-800 bg-[#0D0F14] p-1 shadow-lg">
          <button
            type="button"
            onClick={handleCreateFolder}
            className="w-full flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800/60"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Nova pasta</span>
          </button>

          <button
            type="button"
            onClick={handleCreateProject}
            className="w-full flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-slate-800/60"
          >
            <SquarePlus className="w-3.5 h-3.5" />
            <span>Novo projeto</span>
          </button>
        </div>
      )}
    </div>
  );
}
