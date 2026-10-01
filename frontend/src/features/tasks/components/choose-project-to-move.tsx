import { Layers3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Project } from "@/features/projects/types/project";
import { MovePosition } from "@/types/move-position";

interface ChooseProjectToMoveProps {
  currentProjectId: string;
  projects: Project[];
  onMoveToProject: (projectId: string) => void;
  onCancelMove: () => void;
  position: MovePosition;
}

export function ChooseProjectToMove({
  currentProjectId,
  projects,
  onMoveToProject,
  onCancelMove,
  position,
}: ChooseProjectToMoveProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const availableProjects = projects.filter(
    (project) => project.id !== currentProjectId,
  );

  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      const target = event.target as Node;

      if (!menuRef.current?.contains(target)) {
        onCancelMove();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancelMove]);

  return (
    <div
      ref={menuRef}
      className="fixed z-100 w-64 rounded-md border border-slate-800 bg-[#0D0F14] p-2 shadow-xl"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="space-y-1">
        {availableProjects.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhum outro projeto disponível.
          </p>
        ) : (
          availableProjects.map((project) => {
            const isSelected = selectedProject === project.id;

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => setSelectedProject(project.id)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                  isSelected ? "bg-slate-800/80" : "hover:bg-slate-800/60"
                }`}
              >
                <Layers3
                  className="h-4 w-4 shrink-0"
                  style={{
                    color: project.primaryColor as string,
                  }}
                />

                <span className="min-w-0 flex-1 truncate text-sm text-slate-300">
                  {project.name}
                </span>
              </button>
            );
          })
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
        <button
          type="button"
          onClick={onCancelMove}
          className="cursor-pointer rounded-md px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200"
        >
          Cancelar
        </button>

        <button
          type="button"
          disabled={selectedProject === null}
          onClick={() => {
            if (!selectedProject) {
              return;
            }

            onMoveToProject(selectedProject);
          }}
          className="cursor-pointer rounded-md bg-slate-800 px-3 py-2 text-xs text-slate-200 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mover
        </button>
      </div>
    </div>
  );
}
