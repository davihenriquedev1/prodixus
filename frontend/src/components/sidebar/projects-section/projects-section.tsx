import type { Folder } from "@/features/folders/types/folder";
import type { Project } from "@/features/projects/types/project";
import { ProjectsSectionActions } from "./projects-section-actions";
import { ProjectsSectionTree } from "./projects-section-tree";

interface ProjectsSectionProps {
  folders: Folder[];
  projects: Project[];
  isLoading: boolean;
  error: unknown;
  mutationError: boolean;

  onCreateFolder: (parentId: string | null) => void;
  onUpdateFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;

  onCreateProject: (folderId: string | null) => void;
  onUpdateProject: (project: Project) => void;
  onCompletionToggleProject: (project: Project) => void;
  onArchiveProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

export function ProjectsSection({
  folders,
  projects,
  isLoading,
  error,
  mutationError,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onCreateProject,
  onUpdateProject,
  onCompletionToggleProject,
  onArchiveProject,
  onDeleteProject,
}: ProjectsSectionProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Projetos
        </span>

        <div className="flex items-center text-slate-500">
          <ProjectsSectionActions
            onCreateFolder={() => onCreateFolder(null)}
            onCreateProject={() => onCreateProject(null)}
          />
        </div>
      </div>

      {mutationError && (
        <div className="py-1 text-xs text-red-400">
          Não foi possível concluir a operação.
        </div>
      )}

      {isLoading ? (
        <div className="py-1 text-xs text-slate-500">Carregando...</div>
      ) : error ? (
        <div className="py-1 text-xs text-red-400">
          Não foi possível carregar os projetos.
        </div>
      ) : (
        <div className="text-xs">
          <ProjectsSectionTree
            folders={folders}
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
      )}
    </section>
  );
}
