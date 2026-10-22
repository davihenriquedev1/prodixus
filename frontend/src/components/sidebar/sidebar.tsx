"use client";

import { Circle, Home, Settings, SidebarClose } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useFolderMutations } from "@/features/folders/hooks/use-folder-mutations";
import { useTagMutations } from "@/features/tags/hooks/use-tag-mutations";
import type { CreateProjectData } from "@/features/projects/types/project";
import type { Folder } from "@/features/folders/types/folder";
import type { Project } from "@/features/projects/types/project";
import { ActionConfirm } from "@/components/ui/action-confirm";
import { FolderDialog } from "@/features/folders/components/folder-dialog";
import { TagsSection } from "@/components/sidebar/tags-section/tags-section";
import { ProjectsSection } from "./projects-section/projects-section";
import {
  type CreateTagData,
  type Tag,
  type UpdateTagData,
} from "@/features/tags/types/tag";
import { TagDialog } from "@/features/tags/components/tag-dialog";
import { ProjectDialog } from "@/features/projects/components/project-dialog";
import { useFolders } from "@/features/folders/hooks/use-folders";
import { useTags } from "@/features/tags/hooks/use-tags";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useProjectMutations } from "@/features/projects/hooks/use-project-mutations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePanel } from "@/contexts/panel-context";
import Image from "next/image";

interface SidebarProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
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
  const [completionTogglingProject, setCompletionTogglingProject] =
    useState<Project | null>(null);
  const [archivingProject, setArchivingProject] = useState<Project | null>(
    null,
  );
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);

  const [mutationError, setMutationError] = useState(false);

  const searchParams = useSearchParams();
  const selectedProjectId = searchParams.get("projectId");
  const selectedTagId = searchParams.get("tagId");

  const { openProjectPanel } = usePanel();
  const router = useRouter();
  const location = usePathname();

  const {
    data: folders = [],
    isLoading: isLoadingFolders,
    isError: foldersError,
  } = useFolders();

  const {
    data: projects = [],
    isLoading: isLoadingProjects,
    isError: projectsError,
  } = useProjects();

  const {
    data: tags = [],
    isLoading: isLoadingTags,
    isError: tagsError,
  } = useTags();

  const { createFolderMutation, updateFolderMutation, deleteFolderMutation } =
    useFolderMutations();

  const {
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
  } = useProjectMutations();

  const { createTagMutation, updateTagMutation, deleteTagMutation } =
    useTagMutations();

  async function handleCreateFolder(name: string, parentId: string | null) {
    try {
      setMutationError(false);

      await createFolderMutation.mutateAsync({
        name,
        parentId,
      });
    } catch {
      setMutationError(true);
      throw new Error("Failed to create folder");
    }
  }

  async function handleUpdateFolder(folderId: string, name: string) {
    try {
      setMutationError(false);

      await updateFolderMutation.mutateAsync({
        folderId,
        data: { name },
      });
    } catch {
      setMutationError(true);
      throw new Error("Failed to update folder");
    }
  }

  async function handleDeleteFolder(folderId: string) {
    try {
      setMutationError(false);

      await deleteFolderMutation.mutateAsync(folderId);
    } catch {
      setMutationError(true);
      throw new Error("Failed to delete folder");
    }
  }

  async function handleCreateProject(data: CreateProjectData) {
    try {
      setMutationError(false);

      await createProjectMutation.mutateAsync(data);
    } catch {
      setMutationError(true);
      throw new Error("Failed to create project");
    }
  }

  async function handleCompletionToggleProject(project: Project) {
    try {
      setMutationError(false);

      await updateProjectMutation.mutateAsync({
        projectId: project.id,
        data: {
          completed: !project.completed,
        },
      });

      setCompletionTogglingProject(null);
    } catch {
      setMutationError(true);
      throw new Error("Failed to toggle project completion");
    }
  }

  async function handleArchiveProject(project: Project) {
    try {
      setMutationError(false);

      await updateProjectMutation.mutateAsync({
        projectId: project.id,
        data: { archived: true },
      });

      setArchivingProject(null);
      router.push("/dashboard");
    } catch {
      setMutationError(true);
      throw new Error("Failed to archive project");
    }
  }

  async function handleDeleteProject(projectId: string) {
    try {
      setMutationError(false);
      await deleteProjectMutation.mutateAsync({ projectId });
    } catch {
      setMutationError(true);
      throw new Error("Failed to delete project");
    }
  }

  async function handleCreateTag(data: CreateTagData) {
    try {
      setMutationError(false);
      await createTagMutation.mutateAsync(data);
    } catch {
      setMutationError(true);
      throw new Error("Failed to create tag");
    }
  }

  async function handleUpdateTag(tagId: string, data: UpdateTagData) {
    try {
      setMutationError(false);

      await updateTagMutation.mutateAsync({
        tagId,
        data,
      });
    } catch {
      setMutationError(true);
      throw new Error("Failed to update tag");
    }
  }

  async function handleDeleteTag(tagId: string) {
    try {
      setMutationError(false);
      await deleteTagMutation.mutateAsync(tagId);
    } catch {
      setMutationError(true);
      throw new Error("Failed to delete tag");
    }
  }

  function handleGoToSettings() {
    const lastRoute =
      selectedProjectId !== null || selectedTagId !== null
        ? `${location}${"?"}${searchParams}`
        : location;

    sessionStorage.setItem("settings:returnTo", lastRoute);
    router.push("/settings/preferences");
  }

  return (
    <aside
      className={`absolute left-0 top-0 z-100 flex h-full flex-col justify-between border-r border-border/80 bg-surface/80 backdrop-blur-xl transition-all duration-300 md:relative 
        ${
          open
            ? "visible w-72 min-w-72"
            : "invisible w-0 min-w-0 border-r-0 overflow-hidden"
        }`}
    >
      <div className="space-y-6 overflow-y-auto">
        <div className="relative flex items-center justify-between px-3.5 py-2 h-13.25 border-b border-foreground/7">
          <div className="flex min-w-0 items-center">
            <Image
              src="/logo-horiz-no-background.png"
              alt="Prodixus"
              width={140}
              height={59}
              className="h-auto w-36 max-w-full object-contain"
              priority
            />
          </div>
          <div
            className="flex items-center shrink-0 cursor-pointer"
            title="Abrir/fechar barra lateral"
            aria-label="Abrir/fechar barra lateral"
            onClick={() => setOpen(false)}
          >
            <SidebarClose className="size-6 text-primary" />
          </div>
        </div>
        <nav className="px-3.5">
          <button
            className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
              location === "/dashboard"
                ? "border border-border bg-surface-elevated text-foreground"
                : "border border-transparent border-b-border/40 text-muted hover:bg-surface-elevated/40 hover:text-foreground"
            }`}
            onClick={() => router.push("/dashboard")}
          >
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Início</span>
            </div>

            {location === "/dashboard" ? (
              <Circle className="h-2.5 w-2.5 shrink-0" fill="currentColor" />
            ) : (
              <span className="h-2.5 w-2.5 shrink-0" />
            )}
          </button>
        </nav>
        <div className="flex flex-col gap-3 px-3.5">
          <ProjectsSection
            folders={folders}
            projects={projects}
            isLoading={isLoadingFolders || isLoadingProjects}
            error={foldersError || projectsError}
            mutationError={mutationError}
            selectedProjectId={selectedProjectId}
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
              console.log(
                "Projeto clicado para edição:",
                project.id,
                project.name,
              );
              openProjectPanel(project);
            }}
            onCompletionToggleProject={(project) => {
              setCompletionTogglingProject(project);
            }}
            onArchiveProject={(project) => {
              setArchivingProject(project);
            }}
            onDeleteProject={(project) => {
              setDeletingProject(project);
            }}
          />
          <TagsSection
            tags={tags}
            isLoading={isLoadingTags}
            error={tagsError}
            mutationError={mutationError}
            selectedTagId={selectedTagId}
            onCreateTag={() => {
              setIsCreatingTag(true);
            }}
            onUpdateTag={(tag) => {
              setEditingTag(tag);
            }}
            onDeleteTag={(tag) => {
              setDeletingTag(tag);
            }}
          />
        </div>
      </div>

      <div className="border-t border-border/60 p-3">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-xs text-muted border-l border-foreground/20 hover:bg-surface-elevated/50 hover:text-foreground hover:rounded-lg"
          onClick={handleGoToSettings}
        >
          <Settings className="h-4 w-4" />
          <span>Configurações</span>
        </button>
      </div>

      <ProjectDialog
        open={isCreatingProject}
        initialFolderId={creatingProjectFolderId}
        folders={folders}
        onClose={() => {
          setIsCreatingProject(false);
          setCreatingProjectFolderId(null);
        }}
        onSubmit={(data) =>
          handleCreateProject({
            ...data,
            ...(creatingProjectFolderId && {
              folderId: creatingProjectFolderId,
            }),
          })
        }
      />

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
        open={completionTogglingProject !== null}
        title={
          completionTogglingProject?.completed
            ? "Reabrir projeto"
            : "Concluir projeto"
        }
        message={
          completionTogglingProject?.completed
            ? "Tem certeza que deseja reabrir"
            : "Tem certeza que deseja concluir"
        }
        itemName={completionTogglingProject?.name ?? ""}
        confirmLabel={
          completionTogglingProject?.completed ? "Reabrir" : "Concluir"
        }
        onClose={() => setCompletionTogglingProject(null)}
        onConfirm={() =>
          handleCompletionToggleProject(completionTogglingProject!)
        }
      />

      <ActionConfirm
        open={archivingProject !== null}
        title="Arquivar projeto"
        message="Tem certeza que deseja arquivar"
        itemName={archivingProject?.name ?? ""}
        confirmLabel="Arquivar"
        onClose={() => setArchivingProject(null)}
        onConfirm={() => handleArchiveProject(archivingProject!)}
      />

      <TagDialog
        open={isCreatingTag}
        title="Nova Tag"
        onClose={() => {
          setIsCreatingTag(false);
        }}
        onSubmit={(data) => handleCreateTag(data)}
      />

      <TagDialog
        open={editingTag !== null}
        title="Editar tag"
        initialTag={editingTag}
        onClose={() => {
          setEditingTag(null);
        }}
        onSubmit={(data) => {
          if (!editingTag) {
            return Promise.resolve();
          }

          return handleUpdateTag(editingTag.id, data);
        }}
      />

      <ActionConfirm
        open={deletingTag !== null}
        title="Excluir tag"
        message="Tem certeza que deseja excluir"
        itemName={deletingTag?.name ?? ""}
        confirmLabel="Excluir"
        onClose={() => setDeletingTag(null)}
        onConfirm={() => handleDeleteTag(deletingTag!.id)}
      />
    </aside>
  );
}
