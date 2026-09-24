"use client";

import { Home, Settings } from "lucide-react";
import { ProjectsSectionActions } from "./projects-section/projects-section-actions";
import { ProjectsSectionTree } from "@/components/sidebar/projects-section/projects-section-tree";
import { TagItem } from "@/components/sidebar/tags-section/tag-item";
import { useEffect, useState } from "react";
import {
  createFolder,
  deleteFolder,
  getFolders,
  updateFolder,
} from "@/services/folder.service";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "@/services/project.service";
import type {
  CreateProjectData,
  UpdateProjectData,
} from "@/services/project.service";
import type { Folder } from "@/types/folder";
import type { Project } from "@/types/project";
import { FolderDialog } from "./projects-section/folder/folder-dialog";
import { ActionConfirm } from "../ui/action-confirm";
import { ProjectDialog } from "./projects-section/project/project-dialog";

export function Sidebar() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mutationError, setMutationError] = useState(false);

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [creatingFolderParentId, setCreatingFolderParentId] = useState<
    string | null
  >(null);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);

  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [creatingProjectFolderId, setCreatingProjectFolderId] = useState<
    string | null
  >(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [completingProject, setCompletingProject] = useState<Project | null>(
    null,
  );
  const [archivingProject, setArchivingProject] = useState<Project | null>(
    null,
  );
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  useEffect(() => {
    async function loadSidebarData() {
      try {
        const [foldersData, projectsData] = await Promise.all([
          getFolders(),
          getProjects(),
        ]);

        setFolders(foldersData);
        setProjects(projectsData);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadSidebarData();
  }, []);

  async function handleCreateFolder(name: string, parentId: string | null) {
    try {
      setMutationError(false);

      const folder = await createFolder({ name, parentId });

      setFolders((current) => [...current, folder]);
    } catch {
      setMutationError(true);
      throw new Error("Failed to create folder");
    }
  }

  async function handleUpdateFolder(folderId: string, name: string) {
    try {
      setMutationError(false);

      const folder = await updateFolder(folderId, { name });

      setFolders((current) =>
        current.map((item) => (item.id === folder.id ? folder : item)),
      );
    } catch {
      setMutationError(true);
      throw new Error("Failed to update folder");
    }
  }

  async function handleDeleteFolder(folderId: string) {
    try {
      setMutationError(false);

      await deleteFolder(folderId);

      setFolders((current) =>
        current.filter((folder) => folder.id !== folderId),
      );
    } catch {
      setMutationError(true);
      throw new Error("Failed to delete folder");
    }
  }

  async function handleCreateProject(data: CreateProjectData) {
    try {
      setMutationError(false);

      const project = await createProject(data);

      setProjects((current) => [...current, project]);
    } catch {
      setMutationError(true);
      throw new Error("Failed to create project");
    }
  }

  async function handleUpdateProject(
    projectId: string,
    data: UpdateProjectData,
  ) {
    try {
      setMutationError(false);

      const project = await updateProject(projectId, data);

      setProjects((current) =>
        current.map((item) => (item.id === project.id ? project : item)),
      );
    } catch {
      setMutationError(true);
      throw new Error("Failed to update project");
    }
  }

  async function handleCompleteProject(projectId: string) {
    const project = await updateProject(projectId, {
      completed: true,
    });

    setProjects((current) =>
      current.map((item) => (item.id === project.id ? project : item)),
    );
  }

  async function handleArchiveProject(projectId: string) {
    const project = await updateProject(projectId, {
      archived: true,
    });

    setProjects((current) =>
      current.map((item) => (item.id === project.id ? project : item)),
    );
  }
  async function handleDeleteProject(projectId: string) {
    try {
      setMutationError(false);

      await deleteProject(projectId);

      setProjects((current) =>
        current.filter((project) => project.id !== projectId),
      );
    } catch {
      setMutationError(true);
      throw new Error("Failed to delete project");
    }
  }

  return (
    <aside className="w-72 border-r border-slate-800/60 bg-[#0D0F14]/80 backdrop-blur-xl flex flex-col justify-between z-10">
      <div className="p-3 space-y-6 overflow-y-auto">
        <div className="flex items-center gap-2.5 py-1">
          <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center">
            <div className="w-2 h-2 bg-slate-200 rounded-sm" />
          </div>

          <span className="font-bold tracking-wider text-sm text-slate-100 uppercase">
            Prodixus
          </span>
        </div>

        <nav>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-slate-800/50 text-slate-100 border border-slate-700/50">
            <Home className="w-4 h-4" />
            <span>Início</span>
          </button>
        </nav>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Projetos
            </span>

            <div className="flex items-center text-slate-500">
              <ProjectsSectionActions
                onCreateFolder={() => {
                  setCreatingFolderParentId(null);
                  setIsCreatingFolder(true);
                }}
                onCreateProject={() => {
                  setCreatingProjectFolderId(null);
                  setIsCreatingProject(true);
                }}
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
                onCreateFolder={(parentId) => {
                  setCreatingFolderParentId(parentId);
                  setIsCreatingFolder(true);
                }}
                onUpdateFolder={(folder) => {
                  setEditingFolder(folder);
                }}
                onDeleteFolder={(folder) => {
                  setDeletingFolder(folder);
                }}
                onCreateProject={(folderId) => {
                  setCreatingProjectFolderId(folderId);
                  setIsCreatingProject(true);
                }}
                onUpdateProject={(project) => {
                  setEditingProject(project);
                }}
                onCompleteProject={(project) => {
                  setCompletingProject(project);
                }}
                onArchiveProject={(project) => {
                  setArchivingProject(project);
                }}
                onDeleteProject={(project) => {
                  setDeletingProject(project);
                }}
              />
            </div>
          )}
        </section>

        <section className="space-y-2">
          <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Tags
          </div>

          <div className="space-y-1 text-xs">
            <TagItem name="Urgent" color="red" />
            <TagItem name="In Progress" color="yellow" />
            <TagItem name="Blocked" color="gray" />
          </div>
        </section>
      </div>

      <div className="p-3 border-t border-slate-800/60">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
          <Settings className="w-4 h-4" />
          <span>Configurações</span>
        </button>
      </div>
      <FolderDialog
        open={isCreatingFolder}
        title={creatingFolderParentId ? "Nova subpasta" : "Nova pasta"}
        onClose={() => {
          setIsCreatingFolder(false);
          setCreatingFolderParentId(null);
        }}
        onSubmit={(name) => handleCreateFolder(name, creatingFolderParentId)}
      />
      <FolderDialog
        open={editingFolder !== null}
        title="Editar pasta"
        initialName={editingFolder?.name ?? ""}
        onClose={() => {
          setEditingFolder(null);
        }}
        onSubmit={(name) => {
          if (!editingFolder) {
            return Promise.resolve();
          }

          return handleUpdateFolder(editingFolder.id, name);
        }}
      />
      <ActionConfirm
        open={deletingFolder !== null}
        title="Excluir pasta"
        message="Tem certeza que deseja excluir"
        itemName={deletingFolder?.name ?? ""}
        confirmLabel="Excluir"
        onClose={() => setDeletingFolder(null)}
        onConfirm={() => handleDeleteFolder(deletingFolder!.id)}
      />
      <ProjectDialog
        open={isCreatingProject}
        title="Novo projeto"
        onClose={() => setIsCreatingProject(false)}
        onSubmit={(data) =>
          handleCreateProject({
            ...data,
            ...(creatingProjectFolderId && {
              folderId: creatingProjectFolderId,
            }),
          })
        }
      />
      <ProjectDialog
        open={editingProject !== null}
        title="Editar projeto"
        initialProject={editingProject}
        onClose={() => setEditingProject(null)}
        onSubmit={(data) => handleUpdateProject(editingProject!.id, data)}
      />
      <ActionConfirm
        open={deletingProject !== null}
        title="Excluir projeto"
        message="Tem certeza que deseja excluir"
        itemName={deletingProject?.name ?? ""}
        confirmLabel="Excluir"
        onClose={() => setDeletingProject(null)}
        onConfirm={() => handleDeleteProject(deletingProject!.id)}
      />
      <ActionConfirm
        open={completingProject !== null}
        title="Concluir projeto"
        message="Tem certeza que deseja concluir"
        itemName={completingProject?.name ?? ""}
        confirmLabel="Concluir"
        onClose={() => setCompletingProject(null)}
        onConfirm={() => handleCompleteProject(completingProject!.id)}
      />
      <ActionConfirm
        open={archivingProject !== null}
        title="Arquivar projeto"
        message="Tem certeza que deseja arquivar"
        itemName={archivingProject?.name ?? ""}
        confirmLabel="Arquivar"
        onClose={() => setArchivingProject(null)}
        onConfirm={() => handleArchiveProject(archivingProject!.id)}
      />
    </aside>
  );
}
