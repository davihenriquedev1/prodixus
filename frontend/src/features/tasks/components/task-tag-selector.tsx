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
      className="fixed z-100 w-56 rounded-md border border-slate-800 bg-[#0D0F14] p-1 shadow-xl"
      style={{
        top: position.top,
        left: position.left,
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-2 py-2">
        <div className="flex items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs font-medium text-slate-300">
            Tags da tarefa
          </span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded p-1 text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"
          aria-label="Fechar"
          title="Fechar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto py-1">
        {tags.length === 0 ? (
          <p className="px-2 py-3 text-center text-xs text-slate-500">
            Nenhuma tag cadastrada.
          </p>
        ) : (
          tags.map((tag) => {
            const isSelected = currentTagsIds.has(tag.id);

            return (
              <label
                key={tag.id}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-slate-800/60"
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

                <span className="min-w-0 flex-1 truncate text-xs text-slate-300">
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
