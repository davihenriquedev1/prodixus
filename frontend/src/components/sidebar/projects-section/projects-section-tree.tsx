"use client";

import { useState } from "react";
import type { Folder as FolderType } from "@/features/folders/types/folder";
import type { Project as ProjectType } from "@/features/projects/types/project";
import { FolderNode } from "@/features/folders/components/folder-node";
import { ProjectItem } from "@/features/projects/components/project-item";

interface ProjectsSectionTreeProps {
  folders: FolderType[];
  projects: ProjectType[];
  onCreateFolder: (parentId: string | null) => void;
  onUpdateFolder: (folder: FolderType) => void;
  onDeleteFolder: (folder: FolderType) => void;
  onCreateProject: (folderId: string | null) => void;
  onUpdateProject: (project: ProjectType) => void;
  onCompletionToggleProject: (project: ProjectType) => void;
  onArchiveProject: (project: ProjectType) => void;
  onDeleteProject: (project: ProjectType) => void;
}

export function ProjectsSectionTree({
  folders,
  projects,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onCreateProject,
  onUpdateProject,
  onCompletionToggleProject,
  onArchiveProject,
  onDeleteProject,
}: ProjectsSectionTreeProps) {
  const [selectedProject, setSelectedProject] = useState("");

  const activeProjects = projects.filter((project) => !project.archived);

  return (
    <div className="space-y-1">
      {folders
        .filter((folder) => !folder.parentId)
        .map((folder) => (
          <FolderNode
            key={folder.id}
            folder={folder}
            folders={folders}
            projects={activeProjects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            onCreateFolder={onCreateFolder}
            onUpdateFolder={onUpdateFolder}
            onDeleteFolder={onDeleteFolder}
            onCreateProject={onCreateProject}
            onUpdateProject={onUpdateProject}
            onCompletionToggleProject={onCompletionToggleProject}
            onArchiveProject={onArchiveProject}
            onDeleteProject={onDeleteProject}
          />
        ))}

      {activeProjects
        .filter((project) => !project.folderId)
        .map((project) => (
          <ProjectItem
            key={project.id}
            selected={selectedProject === project.id}
            setSelected={setSelectedProject}
            project={project}
            onUpdateProject={onUpdateProject}
            onCompletionToggleProject={onCompletionToggleProject}
            onArchiveProject={onArchiveProject}
            onDeleteProject={onDeleteProject}
          />
        ))}
    </div>
  );
}
