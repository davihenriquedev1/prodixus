import { Layers3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Project } from "@/features/projects/types/project";
import type { MovePosition } from "@/types/move-position";

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
      className="fixed z-100 w-64 rounded-md border border-border bg-surface-elevated p-2 shadow-xl"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="space-y-1">
        {availableProjects.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            Nenhum outro projeto disponível.
          </p>
        ) : (
          availableProjects.map((project) => {
            const isSelected = selectedProject === project.id;

            return (
              <button
                key={project.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedProject(project.id)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                  isSelected ? "bg-surface" : "hover:bg-surface"
                }`}
              >
                <Layers3
                  className="h-4 w-4 shrink-0"
                  style={{ color: project.primaryColor || "#64748B" }}
                />

                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {project.name}
                </span>
              </button>
            );
          })
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={onCancelMove}
          className="cursor-pointer rounded-md px-3 py-2 text-xs text-muted transition-colors hover:bg-surface hover:text-foreground"
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
          className="cursor-pointer rounded-md bg-primary px-3 py-2 text-xs text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mover
        </button>
      </div>
    </div>
  );
}
