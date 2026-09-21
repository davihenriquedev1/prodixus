"use client";

import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { useState } from "react";
import type { Folder as FolderType } from "@/types/folder";
import type { Project } from "@/types/project";
import { ProjectItem } from "./project-item";
import { FolderActions } from "./folder-actions";
import { ProjectCreateMenu } from "./project-create-menu";

interface FolderTreeProps {
  folders: FolderType[];
  projects: Project[];
  onCreateFolder: (parentId: string | null) => void;
  onCreateProject: (folderId: string | null) => void;
  onUpdateFolder: (folder: FolderType) => void;
  onDeleteFolder: (folder: FolderType) => void;
}

export function FolderTree({
  folders,
  projects,
  onCreateFolder,
  onCreateProject,
  onUpdateFolder,
  onDeleteFolder,
}: FolderTreeProps) {
  return (
    <div className="space-y-1">
      {folders
        .filter((folder) => !folder.parentId)
        .map((folder) => (
          <FolderNode
            key={folder.id}
            folder={folder}
            folders={folders}
            projects={projects}
            onCreateFolder={onCreateFolder}
            onCreateProject={onCreateProject}
            onUpdateFolder={onUpdateFolder}
            onDeleteFolder={onDeleteFolder}
          />
        ))}

      {projects
        .filter((project) => !project.folderId)
        .map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
    </div>
  );
}

interface FolderNodeProps {
  folder: FolderType;
  folders: FolderType[];
  projects: Project[];
  onCreateFolder: (parentId: string | null) => void;
  onCreateProject: (folderId: string | null) => void;
  onUpdateFolder: (folder: FolderType) => void;
  onDeleteFolder: (folder: FolderType) => void;
}

function FolderNode({
  folder,
  folders,
  projects,
  onCreateFolder,
  onCreateProject,
  onUpdateFolder,
  onDeleteFolder,
}: FolderNodeProps) {
  const [open, setOpen] = useState(true);

  const childFolders = folders.filter((child) => child.parentId === folder.id);

  const folderProjects = projects.filter(
    (project) => project.folderId === folder.id,
  );

  const hasChildren = childFolders.length > 0 || folderProjects.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="min-w-0 flex-1 flex items-center gap-2 px-1 py-1.5 rounded hover:bg-slate-800/40 text-slate-300 hover:text-slate-100"
        >
          {hasChildren &&
            (open ? (
              <ChevronDown className="w-2 h-2 shrink-0" />
            ) : (
              <ChevronRight className="w-2 h-2 shrink-0" />
            ))}

          {!hasChildren && <span className="w-2 shrink-0" />}

          <Folder className="w-3.5 h-3.5 shrink-0" />

          <span className="truncate min-w-0">{folder.name}</span>
        </button>

        <div className="flex items-center gap-1">
          <FolderActions
            onEdit={() => onUpdateFolder(folder)}
            onDelete={() => onDeleteFolder(folder)}
          />
          <ProjectCreateMenu
            onCreateFolder={() => onCreateFolder(folder.id)}
            onCreateProject={() => onCreateProject(folder.id)}
          />
        </div>
      </div>

      {open && hasChildren && (
        <div className="ml-4 border-l border-slate-800 space-y-1">
          {childFolders.map((childFolder) => (
            <FolderNode
              key={childFolder.id}
              folder={childFolder}
              folders={folders}
              projects={projects}
              onCreateFolder={onCreateFolder}
              onCreateProject={onCreateProject}
              onUpdateFolder={onUpdateFolder}
              onDeleteFolder={onDeleteFolder}
            />
          ))}

          {folderProjects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
