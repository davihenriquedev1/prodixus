"use client";

import { useState } from "react";
import type { Folder as FolderType } from "@/types/folder";
import type { Project as ProjectType } from "@/types/project";
import { FolderNode } from "./folder/folder-node";
import { ProjectItem } from "./project/project-item";

interface ProjectsSectionTreeProps {
  folders: FolderType[];
  projects: ProjectType[];
  onCreateFolder: (parentId: string | null) => void;
  onUpdateFolder: (folder: FolderType) => void;
  onDeleteFolder: (folder: FolderType) => void;
  onCreateProject: (folderId: string | null) => void;
  onUpdateProject: (project: ProjectType) => void;
  onCompleteProject: (project: ProjectType) => void;
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
  onCompleteProject,
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
            onCompleteProject={onCompleteProject}
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
            onCompleteProject={onCompleteProject}
            onArchiveProject={onArchiveProject}
            onDeleteProject={onDeleteProject}
          />
        ))}
    </div>
  );
}
