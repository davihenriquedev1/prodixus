import { Tag as TagType } from "@/features/tags/types/tag";
import { Tag } from "lucide-react";

interface TaskTagProps {
  tags: TagType[];
}
export function TaskTags({ tags }: TaskTagProps) {
  return (
    <div className="flex gap-2">
      {tags.map((tag) => (
        <div key={tag.id} className="flex items-center text-xs gap-1">
          <Tag className="w-3 h-3" fill={tag.color} stroke="#90a1b9" />
          <span className="text-slate-400/80">{tag.name}</span>
        </div>
      ))}
    </div>
  );
}
