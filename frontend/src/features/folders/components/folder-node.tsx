import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { FolderActions } from "./folder-actions";
import type { Folder as FolderType } from "@/features/folders/types/folder";
import type { Project as ProjectType } from "@/features/projects/types/project";
import { ProjectItem } from "@/features/projects/components/project-item";

interface FolderNodeProps {
  folder: FolderType;
  folders: FolderType[];
  projects: ProjectType[];
  selectedProjectId: string | null;
  expandedFolderIds: Set<string>;
  onToggleFolder: (folderId: string) => void;
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
  expandedFolderIds,
  onToggleFolder,
  onUpdateFolder,
  onDeleteFolder,
  onCreateProject,
  onUpdateProject,
  onCompletionToggleProject,
  onArchiveProject,
  onDeleteProject,
}: FolderNodeProps) {
  const open = expandedFolderIds.has(folder.id);

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
          onClick={() => onToggleFolder(folder.id)}
          className="flex min-w-0 flex-1 cursor-pointer items-center py-1 text-foreground hover:text-primary"
        >
          {hasChildren &&
            (open ? (
              <ChevronDown className="mr-0.5 h-3 w-3 shrink-0" />
            ) : (
              <ChevronRight className="mr-0.5 h-3 w-3 shrink-0" />
            ))}

          {!hasChildren && <span className="mr-0.5 w-3 shrink-0" />}

          <Folder className="mr-1 h-3.5 w-3.5 shrink-0 text-muted" />

          <span className="min-w-0 truncate">{folder.name}</span>
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
        <div className="mt-1 ml-3.75 border-l border-border/70">
          {childFolders.map((childFolder) => (
            <div className="pl-1" key={childFolder.id}>
              <FolderNode
                folder={childFolder}
                folders={folders}
                selectedProjectId={selectedProjectId}
                projects={projects}
                expandedFolderIds={expandedFolderIds}
                onToggleFolder={onToggleFolder}
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
