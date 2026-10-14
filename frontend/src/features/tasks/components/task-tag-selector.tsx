import { Tag, X } from "lucide-react";

import type { Tag as TagType } from "@/features/tags/types/tag";
import type { MovePosition } from "@/types/move-position";

interface TaskTagSelectorProps {
  currentTags: TagType[];
  tags: TagType[];
  onEditTags: (tag: TagType) => void;
  onCancel: () => void;
  position: MovePosition;
}

export function TaskTagSelector({
  currentTags,
  tags,
  onEditTags,
  onCancel,
  position,
}: TaskTagSelectorProps) {
  const currentTagsIds = new Set(currentTags.map((tag) => tag.id));

  function handleClickOnTag(tag: TagType) {
    onEditTags(tag);
  }

  return (
    <div
      className="fixed z-100 w-56 rounded-md border border-border bg-surface-elevated p-1 shadow-xl"
      style={{
        top: position.top,
        left: position.left,
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-border px-2 py-2">
        <div className="flex items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-muted" />
          <span className="text-xs font-medium text-foreground">
            Tags da tarefa
          </span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded p-1 text-muted hover:bg-surface hover:text-foreground"
          aria-label="Fechar"
          title="Fechar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto py-1">
        {tags.length === 0 ? (
          <p className="px-2 py-3 text-center text-xs text-muted">
            Nenhuma tag cadastrada.
          </p>
        ) : (
          tags.map((tag) => {
            const isSelected = currentTagsIds.has(tag.id);

            return (
              <label
                key={tag.id}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-surface"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleClickOnTag(tag)}
                  className="cursor-pointer"
                />

                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />

                <span className="min-w-0 flex-1 truncate text-xs text-foreground">
                  {tag.name}
                </span>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
