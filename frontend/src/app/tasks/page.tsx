"use client";

import { Layers3, Plus, Tag } from "lucide-react";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Task } from "@/features/tasks/types/task";
import { ProjectActions } from "@/features/projects/components/project-actions";
import { ProjectTaskList } from "@/features/tasks/components/project-task-list";
import { ProtectedRoute } from "@/features/auth/components/protected-routes";
import { AppShell } from "@/components/app-shell";
import { TagActions } from "@/features/tags/components/tag-actions";
import { TagTaskList } from "@/features/tasks/components/tag-task-list";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useTags } from "@/features/tags/hooks/use-tags";
import { ActionConfirm } from "@/components/ui/action-confirm";
import { useProjectMutations } from "@/features/projects/hooks/use-project-mutations";
import { useTagMutations } from "@/features/tags/hooks/use-tag-mutations";
import { TagDialog } from "@/features/tags/components/tag-dialog";
import { usePanel } from "@/contexts/panel-context";

function TasksPageContent() {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [isDeleteTagConfirmOpen, setIsDeleteTagConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const tagId = searchParams.get("tagId");

  const {
    data: projects = [],
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useProjects();

  const {
    data: tags = [],
    isLoading: isTagsLoading,
    isError: isTagsError,
  } = useTags();

  const { updateProjectMutation, deleteProjectMutation } =
    useProjectMutations();
  const { deleteTagMutation, updateTagMutation } = useTagMutations();

  const project = projects.find((item) => item.id === projectId) ?? null;
  const tag = tags.find((item) => item.id === tagId) ?? null;

  const isLoading = isProjectsLoading || isTagsLoading;
  const hasError = isProjectsError || isTagsError;

  const { openTaskPanel, openProjectPanel, closePanel } = usePanel();

  function handleOpenDetails(task: Task) {
    setSelectedTask(task);

    openTaskPanel(task, primaryColor, accentColor);
  }

  function handleTaskSelect(task: Task) {
    setSelectedTask(task);
  }

  function handleTaskUpdated(updatedTask: Task) {
    setSelectedTask((current) =>
      current?.id === updatedTask.id ? updatedTask : current,
    );
  }

  function handleClosePanel() {
    closePanel();
  }

  function handleCreateTask() {
    setIsCreatingTask(true);
  }

  function handleProjectCompletionToggle() {
    if (!project) return;

    updateProjectMutation.mutate({
      projectId: project.id,
      data: { completed: !project.completed },
    });
  }

  async function handleProjectArchive() {
    if (!project) return;

    await updateProjectMutation.mutateAsync({
      projectId: project.id,
      data: { archived: !project.archived },
    });
  }

  async function handleProjectDelete() {
    if (!project) return;

    await deleteProjectMutation.mutateAsync({ projectId: project.id });

    setIsDeleteConfirmOpen(false);
    router.push("/dashboard");
  }

  function handleEditTag() {
    if (!tag) return;

    setIsEditingTag(true);
  }

  async function handleTagUpdate(data: { name: string; color: string }) {
    if (!tag) return;

    await updateTagMutation.mutateAsync({
      tagId: tag.id,
      data,
    });
  }

  function handleDeleteTagRequest() {
    if (!tag) return;

    setIsDeleteTagConfirmOpen(true);
  }

  async function handleDeleteTag() {
    if (!tag) return;

    await deleteTagMutation.mutateAsync(tag.id);

    setIsDeleteTagConfirmOpen(false);
    router.push("/dashboard");
  }

  if (isLoading) {
    return (
      <main className="flex-1 p-6">
        <div className="py-20 text-center text-sm text-slate-500">
          Carregando...
        </div>
      </main>
    );
  }

  if (hasError) {
    return (
      <main className="flex-1 p-6">
        <div className="py-20 text-center text-sm text-slate-500">
          Não foi possível carregar os dados.
        </div>
      </main>
    );
  }

  if (projectId && !project) {
    return (
      <main className="flex-1 p-6">
        <div className="py-20 text-center text-sm text-slate-500">
          Projeto não encontrado.
        </div>
      </main>
    );
  }

  if (tagId && !tag) {
    return (
      <main className="flex-1 p-6">
        <div className="py-20 text-center text-sm text-slate-500">
          Tag não encontrada
        </div>
      </main>
    );
  }

  const primaryColor = project?.primaryColor ?? tag?.color ?? "#64748B";
  const accentColor = project?.accentColor ?? "#64748B";
  const errorColor = project?.errorColor ?? "#EF4444";

  return (
    <ProtectedRoute>
      <AppShell>
        <main className="relative flex-1 p-4 overflow-x-hidden">
          <div
            className="pointer-events-none absolute -right-32 z-0 -top-32 h-150 w-150 rounded-full blur-[80px]"
            style={{
              backgroundColor: primaryColor,
              opacity: 0.02,
            }}
          />
          <div
            className="absolute inset-0 z-1 w-full h-full"
            onClick={() => {
              handleClosePanel();
              setSelectedTask(null);
            }}
          />
          <div className="relative z-1">
            <div className="flex items-center justify-between pb-4 z-10">
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-1 rounded-full"
                  style={{
                    backgroundColor: primaryColor,
                    borderBottom: "1px solid ",
                    borderColor: primaryColor,
                  }}
                />
                <div className="flex">
                  {project && projectId && (
                    <>
                      <Layers3
                        className="w-6 h-6 mr-2"
                        style={{ fill: primaryColor }}
                      />
                      <h1 className="text-base font-semibold">
                        {project.name}
                      </h1>
                    </>
                  )}
                  {tag && tagId && (
                    <>
                      <Tag
                        className="w-6 h-6 mr-2"
                        style={{ fill: primaryColor }}
                      />
                      <h1 className="text-base font-semibold">{tag.name}</h1>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center pr-1 ">
                {project && projectId && (
                  <>
                    <button
                      type="button"
                      title="Criar nova tarefa"
                      onClick={handleCreateTask}
                      className="flex cursor-pointer items-center p-1.5 transition-opacity opacity-80 hover:opacity-100 hover:bg-slate-800/60"
                      style={{ color: primaryColor }}
                    >
                      <Plus className="h-6 w-6" />
                    </button>
                    <ProjectActions
                      projectCompleted={project.completed}
                      onEdit={() => {
                        if (project) {
                          openProjectPanel(project);
                        }
                      }}
                      onCompletionToggle={handleProjectCompletionToggle}
                      onArchive={() => setIsArchiveConfirmOpen(true)}
                      onDelete={() => setIsDeleteConfirmOpen(true)}
                      size={6}
                    />
                  </>
                )}
                {tag && tagId && (
                  <TagActions
                    onEdit={handleEditTag}
                    onDelete={handleDeleteTagRequest}
                    size={6}
                  />
                )}
              </div>
            </div>

            <div
              className="opacity-20 mb-4"
              style={{ borderBottom: "1px solid", borderColor: primaryColor }}
            ></div>

            <div className="overflow-x-scroll">
              {project && projectId && (
                <ProjectTaskList
                  projectId={project.id}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  errorColor={errorColor}
                  isCreatingTask={isCreatingTask}
                  selectedTask={selectedTask}
                  onSelectTask={handleTaskSelect}
                  onCreatingTaskChange={setIsCreatingTask}
                  onClearSelectedTask={() => setSelectedTask(null)}
                  onOpenDetails={handleOpenDetails}
                  onTaskUpdated={handleTaskUpdated}
                />
              )}

              {tag && tagId && (
                <TagTaskList
                  tagId={tag.id}
                  color={primaryColor}
                  selectedTask={selectedTask}
                  onSelectTask={handleTaskSelect}
                  onClearSelectedTask={() => setSelectedTask(null)}
                  onOpenDetails={handleOpenDetails}
                  onTaskUpdated={handleTaskUpdated}
                />
              )}
            </div>
          </div>
        </main>
        <TagDialog
          open={isEditingTag && !!tag}
          title="Editar tag"
          initialTag={tag}
          onClose={() => setIsEditingTag(false)}
          onSubmit={handleTagUpdate}
        />
        <ActionConfirm
          open={isDeleteConfirmOpen}
          title="Excluir projeto"
          message="Tem certeza de que deseja excluir o projeto"
          confirmLabel="Excluir projeto"
          itemName={project?.name ?? ""}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleProjectDelete}
        />
        <ActionConfirm
          open={isArchiveConfirmOpen}
          title={"Arquivar projeto"}
          message="Tem certeza de que deseja arquivar o projeto"
          confirmLabel="Arquivar projeto"
          itemName={project?.name ?? ""}
          onClose={() => setIsArchiveConfirmOpen(false)}
          onConfirm={handleProjectArchive}
        />
        <ActionConfirm
          open={isDeleteTagConfirmOpen}
          title="Excluir tag"
          message="Tem certeza de que deseja excluir a tag"
          confirmLabel="Excluir tag"
          itemName={tag?.name ?? ""}
          onClose={() => setIsDeleteTagConfirmOpen(false)}
          onConfirm={handleDeleteTag}
        />
      </AppShell>
    </ProtectedRoute>
  );
}

export default function TasksPage() {
  return (
    <Suspense>
      <TasksPageContent />
    </Suspense>
  );
}
