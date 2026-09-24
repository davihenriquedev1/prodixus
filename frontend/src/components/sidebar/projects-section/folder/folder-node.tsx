import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { useState } from "react";
import { FolderActions } from "./folder-actions";
import type { Folder as FolderType } from "@/types/folder";
import type { Project as ProjectType } from "@/types/project";
import { ProjectItem } from "../project/project-item";

interface FolderNodeProps {
  folder: FolderType;
  folders: FolderType[];
  projects: ProjectType[];
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  onCreateFolder: (parentId: string | null) => void;
  onUpdateFolder: (folder: FolderType) => void;
  onDeleteFolder: (folder: FolderType) => void;
  onCreateProject: (folderId: string | null) => void;
  onUpdateProject: (project: ProjectType) => void;
  onCompletionToggleProject: (project: ProjectType) => void;
  onArchiveProject: (project: ProjectType) => void;
  onDeleteProject: (project: ProjectType) => void;
}

export function FolderNode({
  folder,
  folders,
  projects,
  selectedProject,
  setSelectedProject,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onCreateProject,
  onUpdateProject,
  onCompletionToggleProject,
  onArchiveProject,
  onDeleteProject,
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
          className="min-w-0 flex-1 flex items-center px-1 py-1.5 cursor-pointer hover:bg-slate-800/40 text-slate-300 hover:text-slate-100"
        >
          {hasChildren &&
            (open ? (
              <ChevronDown className="w-3 h-3 shrink-0 mr-1" />
            ) : (
              <ChevronRight className="w-3 h-3 shrink-0 mr-1" />
            ))}

          {!hasChildren && <span className="w-3 shrink-0 mr-1" />}

          <Folder className="w-3.5 h-3.5 shrink-0 mr-2" />

          <span className="truncate min-w-0">{folder.name}</span>
        </button>

        <div className="flex items-center gap-1">
          <FolderActions
            onCreateFolder={() => onCreateFolder(folder.id)}
            onCreateProject={() => onCreateProject(folder.id)}
            onEdit={() => onUpdateFolder(folder)}
            onDelete={() => onDeleteFolder(folder)}
          />
        </div>
      </div>

      {open && hasChildren && (
        <div className="ml-5 border-l border-slate-800 mt-1">
          {childFolders.map((childFolder) => (
            <FolderNode
              key={childFolder.id}
              folder={childFolder}
              folders={folders}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              projects={projects}
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

          {folderProjects.map((project) => (
            <ProjectItem
              selected={selectedProject === project.id}
              setSelected={setSelectedProject}
              key={project.id}
              project={project}
              onCompletionToggleProject={onCompletionToggleProject}
              onArchiveProject={onArchiveProject}
              onUpdateProject={onUpdateProject}
              onDeleteProject={onDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
