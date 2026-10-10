"use client";

import { ListTodo, MoreHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { toast } from "sonner";
import type { Task } from "@/features/tasks/types/task";
import { ProjectTaskItem } from "./project-task-item";
import { ActionConfirm } from "@/components/ui/action-confirm";
import { ChooseProjectToMove } from "./choose-project-to-move";
import { useProjectTasks } from "@/features/tasks/hooks/use-tasks";
import { useTaskMutations } from "@/features/tasks/hooks/use-task-mutations";
import { useTags } from "@/features/tags/hooks/use-tags";
import { useProjects } from "@/features/projects/hooks/use-projects";
import type { MovePosition } from "@/types/move-position";
import type { Tag } from "@/features/tags/types/tag";
import { TaskTagSelector } from "./task-tag-selector";

interface ProjectTaskListProps {
  projectId: string;
  primaryColor: string;
  accentColor: string;
  errorColor: string;
  isCreatingTask: boolean;
  selectedTask: Task | null;
  onSelectTask: (task: Task) => void;
  onClearSelectedTask: () => void;
  onOpenDetails: (task: Task) => void;
  onCreatingTaskChange: (value: boolean) => void;
  onTaskUpdated: (task: Task) => void;
}

export function ProjectTaskList({
  projectId,
  primaryColor,
  accentColor,
  errorColor,
  isCreatingTask,
  selectedTask,
  onSelectTask,
  onClearSelectedTask,
  onOpenDetails,
  onCreatingTaskChange,
  onTaskUpdated,
}: ProjectTaskListProps) {
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);
  const newTaskInputRef = useRef<HTMLInputElement>(null);
  const newTaskItemRef = useRef<HTMLDivElement>(null);

  const [isCreatingTaskRequest, setIsCreatingTaskRequest] = useState(false);
  const [isCreatingSubtaskRequest, setIsCreatingSubtaskRequest] =
    useState(false);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const newSubtaskInputRef = useRef<HTMLInputElement>(null);
  const newSubtaskItemRef = useRef<HTMLDivElement>(null);

  const [actionTask, setActionTask] = useState<Task | null>(null);
  const [actionConfirmType, setActionConfirmType] = useState<
    "archive" | "delete" | null
  >(null);

  const [taskToMove, setTaskToMove] = useState<Task | null>(null);
  const [moveMenuPosition, setMoveMenuPosition] = useState<MovePosition>({
    top: 0,
    left: 0,
  });

  const [taskToEditTags, setTaskToEditTags] = useState<Task | null>(null);
  const [tagMenuPosition, setTagMenuPosition] = useState<MovePosition>({
    top: 0,
    left: 0,
  });

  const {
    data: projectTasks = [],
    isLoading,
    isError: error,
  } = useProjectTasks(projectId);

  const tasks = projectTasks.filter((task) => !task.archived);

  const { data: tags = [] } = useTags();

  const { data: allProjects = [] } = useProjects();

  const projects = allProjects.filter((project) => !project.archived);

  const {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    addTagToTaskMutation,
    removeTagFromTaskMutation,
  } = useTaskMutations();

  const subtasksByParent = tasks.reduce<Record<string, Task[]>>(
    (groups, task) => {
      if (!task.parentId) {
        return groups;
      }

      if (!groups[task.parentId]) {
        groups[task.parentId] = [];
      }

      groups[task.parentId].push(task);

      return groups;
    },
    {},
  );

  async function handleCreateTask() {
    const title = newTaskTitle.trim();

    if (!title || isCreatingTaskRequest) {
      return;
    }

    setIsCreatingTaskRequest(true);

    try {
      await createTaskMutation.mutateAsync({
        title,
        projectId,
      });

      setNewTaskTitle("");
      onCreatingTaskChange(false);
    } catch {
      toast.error("Não foi possível criar a tarefa.");
    } finally {
      setIsCreatingTaskRequest(false);
    }
  }

  const handleCancelCreateTask = useCallback(() => {
    setNewTaskTitle("");
    onCreatingTaskChange(false);
  }, [onCreatingTaskChange]);

  function handleKeyDownCreating(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      void handleCreateTask();
    }

    if (event.key === "Escape") {
      handleCancelCreateTask();
    }
  }

  async function handleCreateSubtask() {
    if (!parentTaskId || isCreatingSubtaskRequest) {
      return;
    }

    const title = newSubtaskTitle.trim();

    if (!title) {
      return;
    }

    setIsCreatingSubtaskRequest(true);

    try {
      await createTaskMutation.mutateAsync({
        title,
        projectId,
        parentId: parentTaskId,
      });

      setNewSubtaskTitle("");
      setParentTaskId(null);
    } catch {
      toast.error("Não foi possível criar a subtarefa.");
    } finally {
      setIsCreatingSubtaskRequest(false);
    }
  }

  function handleStartCreateSubtask(taskId: string) {
    setParentTaskId(taskId);
    setNewSubtaskTitle("");
  }

  function handleKeyDownCreatingSubtask(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      void handleCreateSubtask();
    }

    if (event.key === "Escape") {
      setNewSubtaskTitle("");
      setParentTaskId(null);
    }
  }

  async function handleTitleDynamicUpdate(task: Task, title: string) {
    const normalizedTitle = title.trim();

    if (!normalizedTitle || normalizedTitle === task.title) {
      return;
    }

    if (pendingTaskId === task.id) {
      return;
    }

    setPendingTaskId(task.id);

    try {
      const updatedTask = await updateTaskMutation.mutateAsync({
        projectId: task.projectId,
        taskId: task.id,
        data: {
          title: normalizedTitle,
        },
      });

      onTaskUpdated(updatedTask);
    } catch {
      toast.error("Não foi possível atualizar o título da tarefa.");
    } finally {
      setPendingTaskId(null);
    }
  }

  async function handleCompletionToggle(task: Task) {
    if (pendingTaskId === task.id) {
      return;
    }

    setPendingTaskId(task.id);

    try {
      const updatedTask = await updateTaskMutation.mutateAsync({
        projectId: task.projectId,
        taskId: task.id,
        data: {
          completed: !task.completed,
        },
      });

      onTaskUpdated(updatedTask);
    } catch {
      toast.error("Não foi possível atualizar a tarefa.");
    } finally {
      setPendingTaskId(null);
    }
  }

  function handleOpenTagSelector(task: Task, position: MovePosition) {
    setTaskToEditTags(task);
    setTagMenuPosition(position);
  }

  async function handleEditTags(tag: Tag) {
    if (!taskToEditTags || pendingTaskId === taskToEditTags.id) {
      return;
    }

    const task = taskToEditTags;
    const hasTag = taskToEditTags.tags.some(
      (currentTag) => currentTag.id === tag.id,
    );

    setPendingTaskId(task.id);

    try {
      if (hasTag) {
        await removeTagFromTaskMutation.mutateAsync({
          taskId: task.id,
          tagId: tag.id,
        });

        setTaskToEditTags({
          ...task,
          tags: task.tags.filter((currentTag) => currentTag.id !== tag.id),
        });
      } else {
        await addTagToTaskMutation.mutateAsync({
          taskId: task.id,
          tagId: tag.id,
        });

        setTaskToEditTags({
          ...task,
          tags: [...task.tags, tag],
        });
      }
    } catch {
      toast.error("Erro ao atualizar as tags da tarefa.");
    } finally {
      setPendingTaskId(null);
    }
  }

  const handleCancelEditTags = useCallback(() => {
    setTaskToEditTags(null);
  }, []);

  async function handleConvertToParent(task: Task) {
    if (pendingTaskId === task.id) {
      return;
    }

    setPendingTaskId(task.id);

    try {
      const updatedTask = await updateTaskMutation.mutateAsync({
        projectId: task.projectId,
        taskId: task.id,
        data: {
          parentId: null,
        },
      });

      onTaskUpdated(updatedTask);
    } catch {
      toast.error("Não foi possível transformar a tarefa em principal.");
    } finally {
      setPendingTaskId(null);
    }
  }

  function handleMoveTask(task: Task, position: MovePosition) {
    setTaskToMove(task);
    setMoveMenuPosition(position);
  }

  async function handleChooseProject(targetProjectId: string) {
    if (!taskToMove || pendingTaskId === taskToMove.id) {
      return;
    }

    const task = taskToMove;

    setPendingTaskId(task.id);
    setTaskToMove(null);

    try {
      const updatedTask = await updateTaskMutation.mutateAsync({
        projectId: task.projectId,
        taskId: task.id,
        data: {
          projectId: targetProjectId,
        },
      });

      if (selectedTask?.id === updatedTask.id) {
        onClearSelectedTask();
      }
    } catch {
      toast.error("Não foi possível mover a tarefa.");
    } finally {
      setPendingTaskId(null);
    }
  }

  const handleCancelMove = useCallback(() => {
    setTaskToMove(null);
  }, []);

  function handleArchiveTask(task: Task) {
    setActionTask(task);
    setActionConfirmType("archive");
  }

  function handleDeleteTask(task: Task) {
    setActionTask(task);
    setActionConfirmType("delete");
  }

  async function handleConfirmAction() {
    if (!actionTask || !actionConfirmType) {
      return;
    }

    if (pendingTaskId === actionTask.id) {
      return;
    }

    setPendingTaskId(actionTask.id);
    try {
      if (actionConfirmType === "archive") {
        await updateTaskMutation.mutateAsync({
          projectId: actionTask.projectId,
          taskId: actionTask.id,
          data: {
            archived: true,
          },
        });
      }

      if (actionConfirmType === "delete") {
        await deleteTaskMutation.mutateAsync({
          projectId: actionTask.projectId,
          taskId: actionTask.id,
        });
      }

      if (selectedTask?.id === actionTask.id) {
        onClearSelectedTask();
      }

      setActionTask(null);
      setActionConfirmType(null);
    } catch {
      toast.error(
        actionConfirmType === "archive"
          ? "Não foi possível arquivar a tarefa."
          : "Não foi possível excluir a tarefa.",
      );
    } finally {
      setPendingTaskId(null);
    }
  }

  useEffect(() => {
    if (!isCreatingTask) {
      return;
    }

    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node;

      if (newTaskItemRef.current && !newTaskItemRef.current.contains(target)) {
        handleCancelCreateTask();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleCancelCreateTask, isCreatingTask]);

  useEffect(() => {
    if (isCreatingTask && parentTaskId === null) {
      newTaskInputRef.current?.focus();
    }
  }, [isCreatingTask, parentTaskId]);

  useEffect(() => {
    if (parentTaskId === null) {
      return;
    }

    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node;

      if (
        newSubtaskItemRef.current &&
        !newSubtaskItemRef.current.contains(target)
      ) {
        setNewSubtaskTitle("");
        setParentTaskId(null);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);

    newSubtaskInputRef.current?.focus();

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [parentTaskId]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: primaryColor }}
        />
        Carregando tarefas...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center gap-2 py-4 text-sm"
        style={{ color: errorColor }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: errorColor }}
        />
        Não foi possível carregar as tarefas.
      </div>
    );
  }

  if (tasks.length === 0 && !isCreatingTask) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <ListTodo className="h-5 w-5" style={{ color: accentColor }} />

        <p className="text-sm text-slate-500">Nenhuma tarefa neste projeto.</p>

        <p className="text-xs text-slate-600">
          Crie uma nova tarefa para começar.
        </p>
      </div>
    );
  }

  const actionTaskHasSubtasks =
    actionTask !== null && (subtasksByParent[actionTask.id]?.length ?? 0) > 0;

  return (
    <>
      <div className="space-y-2">
        <AnimatePresence>
          {isCreatingTask && parentTaskId === null && (
            <motion.div
              ref={newTaskItemRef}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="group flex items-center gap-3 bg-slate-800/10 px-3 py-2"
              style={{
                border: `1px solid ${accentColor}`,
              }}
            >
              <div className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-500 opacity-40" />

              <input
                ref={newTaskInputRef}
                disabled={isCreatingTaskRequest}
                type="text"
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                onKeyDown={handleKeyDownCreating}
                placeholder="Nome da tarefa..."
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent p-1 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border focus:border-slate-600/40"
              />

              <div className="flex items-center">
                <div className="flex shrink-0 items-center justify-center p-1.5">
                  <MoreHorizontal className="h-6 w-6 text-slate-500/30" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {tasks
          .filter((task) => !task.parentId)
          .map((task) => (
            <ProjectTaskItem
              key={task.id}
              task={task}
              parentTaskId={parentTaskId}
              subtasks={subtasksByParent[task.id] ?? []}
              selectedTask={selectedTask}
              onSelect={onSelectTask}
              primaryColor={primaryColor}
              accentColor={accentColor}
              onMove={handleMoveTask}
              onCompletionToggle={handleCompletionToggle}
              onArchive={handleArchiveTask}
              onDelete={handleDeleteTask}
              onOpenDetails={onOpenDetails}
              onEditTags={handleOpenTagSelector}
              onCreateSubtask={handleStartCreateSubtask}
              newSubtaskInputRef={newSubtaskInputRef}
              newSubtaskItemRef={newSubtaskItemRef}
              newSubtaskTitle={newSubtaskTitle}
              setNewSubtaskTitle={setNewSubtaskTitle}
              isCreatingSubtask={parentTaskId !== null}
              handleKeyDownCreatingSubtask={handleKeyDownCreatingSubtask}
              pendingTaskId={pendingTaskId}
              onConvertToParent={handleConvertToParent}
              onTitleUpdate={handleTitleDynamicUpdate}
            />
          ))}
      </div>
      <ActionConfirm
        open={actionTask !== null && actionConfirmType !== null}
        title={
          actionConfirmType === "archive" ? "Arquivar tarefa" : "Excluir tarefa"
        }
        message={
          actionConfirmType === "archive"
            ? "Tem certeza que deseja arquivar"
            : actionTaskHasSubtasks
              ? "Esta tarefa possui subtarefas. Todas elas também serão excluídas. Tem certeza que deseja excluir"
              : "Tem certeza que deseja excluir"
        }
        confirmLabel={actionConfirmType === "archive" ? "Arquivar" : "Excluir"}
        itemName={actionTask?.title ?? ""}
        onClose={() => {
          setActionTask(null);
          setActionConfirmType(null);
        }}
        onConfirm={handleConfirmAction}
      />
      {taskToMove !== null && (
        <ChooseProjectToMove
          currentProjectId={projectId}
          projects={projects}
          onMoveToProject={handleChooseProject}
          onCancelMove={handleCancelMove}
          position={moveMenuPosition}
        />
      )}
      {taskToEditTags !== null && (
        <TaskTagSelector
          currentTags={taskToEditTags.tags}
          tags={tags}
          onEditTags={handleEditTags}
          onCancel={handleCancelEditTags}
          position={tagMenuPosition}
        />
      )}
    </>
  );
}
