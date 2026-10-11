export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  data: () => [...dashboardQueryKeys.all, "data"] as const,
};
