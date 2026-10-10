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
          className={`min-w-0 flex-1 flex items-center py-1 cursor-pointer ${
            project.completed
              ? "text-slate-500"
              : "text-slate-300 hover:text-slate-100"
          }`}
          style={selected ? { color: "#f8fafc" } : {}}
        >
          {project.completed ? (
            <Check className="w-2.5 h-2.5 shrink-0 mr-1" />
          ) : selected ? (
            <Circle
              className="w-2.5 h-2.5 shrink-0 mr-1"
              fill={project.primaryColor || ""}
            />
          ) : (
            <span className="w-2.5 shrink-0 mr-1" />
          )}

          <Layers3 className="w-3.5 h-3.5 mr-1" />

          <span className="truncate">{project.name}</span>
        </button>

        <div className="hover:bg-slate-800/40 flex items-center justify-center">
          <ProjectActions
            onEdit={() => onUpdateProject(project)}
            onCompletionToggle={() => onCompletionToggleProject(project)}
            projectCompleted={project.completed}
            onArchive={() => onArchiveProject(project)}
            onDelete={() => onDeleteProject(project)}
          />
        </div>
      </div>

      {project.completed && (
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-slate-400/30" />
      )}
    </div>
  );
}
