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
