"use client";

import { Circle, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tag as TagType } from "../types/tag";
import { TagActions } from "./tag-actions";

interface TagItemProps {
  tag: TagType;
  taskCount: number;
  selected: boolean;
  onUpdateTag: (tag: TagType) => void;
  onDeleteTag: (tag: TagType) => void;
}

export function TagItem({
  tag,
  taskCount,
  selected,
  onUpdateTag,
  onDeleteTag,
}: TagItemProps) {
  const router = useRouter();

  function selectTag() {
    router.push(`/tasks?tagId=${tag.id}`);
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={selectTag}
          className="min-w-0 flex-1 flex items-center py-1 cursor-pointer text-slate-300 hover:text-slate-100"
          style={selected ? { color: "#f8fafc" } : {}}
        >
          {selected ? (
            <Circle className="w-2.5 h-2.5 shrink-0 mr-1" fill="#90a1b9" />
          ) : (
            <span className="w-2.5 shrink-0 mr-1" />
          )}

          <Tag className="w-3.5 h-3.5 mr-1" fill={tag.color} />

          <span className="truncate mr-1">{tag.name}</span>
          <span
            className="text-xs text-slate-500/70"
            title="Tarefas a realizar"
          >
            ({taskCount})
          </span>
        </button>

        <div className="hover:bg-slate-800/80 flex items-center justify-center">
          <TagActions
            onEdit={() => onUpdateTag(tag)}
            onDelete={() => onDeleteTag(tag)}
          />
        </div>
      </div>
    </div>
  );
}
