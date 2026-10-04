import { TagItem } from "@/features/tags/components/tag-item";
import { Tag } from "@/features/tags/types/tag";
import { useState } from "react";

interface TagsSectionListProps {
  tags: Tag[];
  onCreateTag: (tag: Tag) => void;
  onUpdateTag: (tag: Tag) => void;
  onDeleteTag: (tag: Tag) => void;
}
export function TagsSectionList({
  tags,
  onUpdateTag,
  onDeleteTag,
}: TagsSectionListProps) {
  const [selectedTag, setSelectedTag] = useState("");

  return (
    <div className="space-y-1">
      {tags.map((tag) => (
        <TagItem
          key={tag.id}
          tag={tag}
          selected={selectedTag === tag.id}
          setSelected={setSelectedTag}
          onUpdateTag={onUpdateTag}
          onDeleteTag={onDeleteTag}
        />
      ))}
    </div>
  );
}
