export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderData {
  name: string;
  parentId?: string | null;
}

export interface UpdateFolderData {
  name?: string;
  parentId?: string | null;
}
