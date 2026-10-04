"use client";

import { Layers3, Plus, Tag } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Task } from "@/features/tasks/types/task";
import { ProjectActions } from "@/features/projects/components/project-actions";
import { getProjects } from "@/features/projects/services/project.service";
import type { Project } from "@/features/projects/types/project";
import { ProjectTaskList } from "@/features/tasks/components/project-task-list";
import { ProtectedRoute } from "@/features/auth/components/protected-routes";
import { AppShell } from "@/components/app-shell";
import { Panel } from "@/components/ui/panel";
import { TaskSettings } from "@/features/tasks/components/task-settings";
import { AnimatePresence } from "motion/react";
import { Tag as TagType } from "@/features/tags/types/tag";
import { getTags } from "@/features/tags/services/tag.service";
import { TagActions } from "@/features/tags/components/tag-actions";
import { TagTaskList } from "@/features/tasks/components/tag-task-list";

function TasksPageContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const tagId = searchParams.get("tagId");

  const [project, setProject] = useState<Project | null>(null);
  const [tag, setTag] = useState<TagType | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [updatedTask, setUpdatedTask] = useState<Task | null>(null);

  const editingTaskRef = useRef<Task | null>(null);

  useEffect(() => {
    editingTaskRef.current = editingTask;
  }, [editingTask]);

  useEffect(() => {
    async function loadProject() {
      try {
        const projects = await getProjects();
        setProject(projects.find((item) => item.id === projectId) ?? null);
      } finally {
        setIsLoading(false);
      }
    }

    async function loadTag() {
      try {
        const tags = await getTags();
        setTag(tags.find((item) => item.id === tagId) ?? null);
      } finally {
        setIsLoading(false);
      }
    }

    if (projectId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTag(null);
      loadProject();
    } else if (tagId) {
      setProject(null);
      loadTag();
    }
  }, [projectId, tagId]);

  function handleOpenDetails(task: Task) {
    setEditingTask(task);
    setSelectedTask(task);
  }

  function handleTaskSelect(task: Task) {
    setSelectedTask(task);

    if (editingTask) {
      setEditingTask(task);
    }
  }

  function handleCreateTask() {
    setIsCreatingTask(true);
  }

  function handleTaskUpdated(updatedTask: Task) {
    setUpdatedTask(updatedTask);

    if (editingTaskRef.current?.id === updatedTask.id) {
      setEditingTask(updatedTask);
    }
  }

  function handleClosePanel() {
    editingTaskRef.current = null;
    setEditingTask(null);
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
          <div className="relative z-10">
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
                      onEdit={() => {}}
                      onCompletionToggle={() => {}}
                      onArchive={() => {}}
                      onDelete={() => {}}
                      size={6}
                    />
                  </>
                )}

                {tag && tagId && (
                  <>
                    <TagActions onDelete={() => {}} onEdit={() => {}} />
                  </>
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
                  updatedTask={updatedTask}
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
                  updatedTask={updatedTask}
                />
              )}
            </div>
          </div>
        </main>
        <AnimatePresence>
          {editingTask && (
            <Panel>
              <TaskSettings
                task={editingTask}
                onClose={handleClosePanel}
                onTaskUpdated={handleTaskUpdated}
                primaryColor={primaryColor}
                accentColor={accentColor}
              />
            </Panel>
          )}
        </AnimatePresence>
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
