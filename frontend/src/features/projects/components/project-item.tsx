"use client";

import { Check, Circle, Layers3 } from "lucide-react";
import type { Project } from "@/features/projects/types/project";
import { ProjectActions } from "./project-actions";
import type { Project as ProjectType } from "@/features/projects/types/project";
import { useRouter } from "next/navigation";

interface ProjectItemProps {
  project: Project;
  selected: boolean;
  onUpdateProject: (project: ProjectType) => void;
  onCompletionToggleProject: (project: ProjectType) => void;
  onArchiveProject: (project: ProjectType) => void;
  onDeleteProject: (project: ProjectType) => void;
}

export function ProjectItem({
  project,
  selected,
  onUpdateProject,
  onCompletionToggleProject,
  onArchiveProject,
  onDeleteProject,
}: ProjectItemProps) {
  const router = useRouter();

  function selectProject() {
    router.push(`/tasks?projectId=${project.id}`);
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={selectProject}
          className={`flex min-w-0 flex-1 cursor-pointer items-center py-1 ${
            project.completed
              ? "text-subtle"
              : "text-foreground hover:text-primary"
          }`}
          style={selected ? { color: "var(--color-foreground)" } : {}}
        >
          {project.completed ? (
            <Check className="mr-1 h-2.5 w-2.5 shrink-0" />
          ) : selected ? (
            <Circle
              className="mr-1 h-2.5 w-2.5 shrink-0"
              fill={project.primaryColor || ""}
            />
          ) : (
            <span className="mr-1 w-2.5 shrink-0" />
          )}

          <Layers3 className="mr-1 h-3.5 w-3.5 text-muted" />

          <span className="truncate">{project.name}</span>
        </button>

        <div className="flex items-center justify-center hover:bg-surface-elevated">
          <ProjectActions
            onEdit={() => {
              console.log("2. onEdit do ProjectItem executado:", project.name);
              onUpdateProject(project);
            }}
            onCompletionToggle={() => onCompletionToggleProject(project)}
            projectCompleted={project.completed}
            onArchive={() => onArchiveProject(project)}
            onDelete={() => onDeleteProject(project)}
          />
        </div>
      </div>

      {project.completed && (
        <div className="pointer-events-none absolute top-1/2 right-0 left-0 h-px bg-border" />
      )}
    </div>
  );
}
