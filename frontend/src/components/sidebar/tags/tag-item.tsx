import { Tag } from "lucide-react";

interface TagItemProps {
  name: string;
  color?: string;
}

export function TagItem({ name, color }: TagItemProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded text-slate-300">
      <Tag className="w-3.5 h-3.5" fill={color} />
      <span className="truncate">{name}</span>
    </div>
  );
}
