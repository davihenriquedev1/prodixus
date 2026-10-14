export const taskQueryKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskQueryKeys.all, "list"] as const,
  project: (projectId: string) =>
    [...taskQueryKeys.lists(), "project", projectId] as const,
  tag: (tagId: string) => [...taskQueryKeys.lists(), "tag", tagId] as const,
  detail: (taskId: string) => [...taskQueryKeys.all, "detail", taskId] as const,
};
