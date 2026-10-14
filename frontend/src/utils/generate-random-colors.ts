export const DEFAULT_ERROR_COLOR = "#EF4444";

export function generateRandomColor(): string {
  const value = Math.floor(Math.random() * 0xffffff);

  return `#${value.toString(16).padStart(6, "0")}`;
}
