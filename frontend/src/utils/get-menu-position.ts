import type { MovePosition } from "@/types/move-position";

export function getMenuPosition(
  element: HTMLElement,
  menuWidth: number,
  menuHeight: number,
  gap: number,
): MovePosition {
  const rect = element.getBoundingClientRect();

  const spaceRight = window.innerWidth - rect.right;
  const spaceBottom = window.innerHeight - rect.bottom;

  const left =
    spaceRight >= menuWidth + gap
      ? rect.right + gap
      : rect.left - menuWidth - gap;

  const top =
    spaceBottom >= menuHeight + gap ? rect.top : rect.bottom - menuHeight;

  return {
    top: Math.max(gap, Math.min(top, window.innerHeight - menuHeight - gap)),
    left: Math.max(gap, Math.min(left, window.innerWidth - menuWidth - gap)),
  };
}
