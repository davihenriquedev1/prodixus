"use client";

import { Circle, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tag as TagType } from "../types/tag";
import { TagActions } from "./tag-actions";

interface TagItemProps {
  tag: TagType;
  selected: boolean;
  setSelected: (tagId: string) => void;
  onUpdateTag: (tag: TagType) => void;
  onDeleteTag: (tag: TagType) => void;
}

export function TagItem({
  tag,
  selected,
  setSelected,
  onUpdateTag,
  onDeleteTag,
}: TagItemProps) {
  const router = useRouter();

  function selectTag() {
    setSelected(tag.id);
    router.push(`/tasks?tagId=${tag.id}`);
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={selectTag}
          className="min-w-0 flex-1 flex items-center px-1 py-1.5 cursor-pointer hover:bg-slate-800/40"
        >
          {selected ? (
            <Circle className="w-3 h-3 shrink-0 mr-1" fill="#90a1b9" />
          ) : (
            <span className="w-3 shrink-0 mr-1" />
          )}

          <Tag className="w-3.5 h-3.5 mr-2" fill={tag.color} />

          <span className="truncate">{tag.name}</span>
        </button>

        <div className="hover:bg-slate-800/40 flex items-center justify-center">
          <TagActions
            onEdit={() => onUpdateTag(tag)}
            onDelete={() => onDeleteTag(tag)}
          />
        </div>
      </div>
    </div>
  );
}
