export interface Project {
  id: string;
  name: string;
  notes: string | null;
  completed: boolean;
  archived: boolean;
  estimatedDuration: number | null;
  dueAt: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  errorColor: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  folderId: string | null;
}

export interface CreateProjectData {
  name: string;
  estimatedDuration?: number;
  dueAt?: string;
  primaryColor?: string;
  accentColor?: string;
  errorColor?: string;
  folderId?: string;
}

export interface UpdateProjectData {
  name?: string;
  notes?: string | null;
  completed?: boolean;
  archived?: boolean;
  estimatedDuration?: number | null;
  dueAt?: string | null;
  primaryColor?: string;
  accentColor?: string;
  errorColor?: string;
  folderId?: string;
}
