"use client";

import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { useState } from "react";
import type { Folder as FolderType } from "@/types/folder";
import type { Project } from "@/types/project";
import { ProjectItem } from "./project-item";

interface FolderTreeProps {
  folders: FolderType[];
  projects: Project[];
}

export function FolderTree({ folders, projects }: FolderTreeProps) {
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
}

function FolderNode({ folder, folders, projects }: FolderNodeProps) {
  const [open, setOpen] = useState(true);

  const childFolders = folders.filter((child) => child.parentId === folder.id);

  const folderProjects = projects.filter(
    (project) => project.folderId === folder.id,
  );

  const hasChildren = childFolders.length > 0 || folderProjects.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
      >
        {hasChildren &&
          (open ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          ))}

        {!hasChildren && <span className="w-3" />}

        <Folder className="w-3.5 h-3.5" />

        <span className="truncate">{folder.name}</span>
      </button>

      {open && hasChildren && (
        <div className="ml-4 pl-2 border-l border-slate-800 space-y-1">
          {childFolders.map((childFolder) => (
            <FolderNode
              key={childFolder.id}
              folder={childFolder}
              folders={folders}
              projects={projects}
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
