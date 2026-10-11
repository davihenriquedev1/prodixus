import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { useState } from "react";
import { FolderActions } from "./folder-actions";
import type { Folder as FolderType } from "@/features/folders/types/folder";
import type { Project as ProjectType } from "@/features/projects/types/project";
import { ProjectItem } from "@/features/projects/components/project-item";

interface FolderNodeProps {
  folder: FolderType;
  folders: FolderType[];
  projects: ProjectType[];
  selectedProjectId: string | null;
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
  selectedProjectId,
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
          className="min-w-0 flex-1 flex items-center py-1 cursor-pointer text-slate-200 hover:text-slate-100"
        >
          {hasChildren &&
            (open ? (
              <ChevronDown className="w-3 h-3 shrink-0 mr-0.5" />
            ) : (
              <ChevronRight className="w-3 h-3 shrink-0 mr-0.5" />
            ))}

          {!hasChildren && <span className="w-3 shrink-0 mr-0.5" />}

          <Folder className="w-3.5 h-3.5 shrink-0 mr-1" />

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
        <div className="ml-3.75 border-l border-slate-800/70 mt-1">
          {childFolders.map((childFolder) => (
            <div className="pl-1" key={childFolder.id}>
              <FolderNode
                folder={childFolder}
                folders={folders}
                selectedProjectId={selectedProjectId}
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
            </div>
          ))}

          {folderProjects.map((project) => (
            <div className="pl-1" key={project.id}>
              <ProjectItem
                selected={selectedProjectId === project.id}

                project={project}
                onCompletionToggleProject={onCompletionToggleProject}
                onArchiveProject={onArchiveProject}
                onUpdateProject={onUpdateProject}
                onDeleteProject={onDeleteProject}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
