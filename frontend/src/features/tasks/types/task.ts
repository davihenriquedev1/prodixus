export interface Task {
  id: string;
  title: string;
  notes: string | null;
  priority: number;
  estimatedDuration: number | null;
  startAt: string | null;
  dueAt: string | null;
  completed: boolean;
  archived: boolean;
  projectId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  projectId: string;
  parentId?: string;
  notes?: string;
  priority?: number;
  estimatedDuration?: number;
  startAt?: string;
  dueAt?: string;
}

export interface UpdateTaskData {
  title?: string;
  notes?: string | null;
  priority?: number;
  estimatedDuration?: number | null;
  startAt?: string | null;
  dueAt?: string | null;
  completed?: boolean;
  archived?: boolean;
  parentId?: string | null;
  projectId?: string;
}
