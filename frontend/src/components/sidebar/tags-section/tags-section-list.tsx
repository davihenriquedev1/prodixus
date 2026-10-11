import { TagItem } from "@/features/tags/components/tag-item";
import { Tag } from "@/features/tags/types/tag";
import { getTagTasks } from "@/features/tasks/services/task.service";
import { useEffect, useState } from "react";

interface TagsSectionListProps {
  tags: Tag[];
  selectedTagId: string | null;
  onCreateTag: (tag: Tag) => void;
  onUpdateTag: (tag: Tag) => void;
  onDeleteTag: (tag: Tag) => void;
}
export function TagsSectionList({
  tags,
  selectedTagId,
  onUpdateTag,
  onDeleteTag,
}: TagsSectionListProps) {
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadTaskCounts() {
      const results = await Promise.all(
        tags.map(async (tag) => {
          const tasks = await getTagTasks(tag.id);

          return {
            tagId: tag.id,
            count: tasks.filter((task) => !task.archived && !task.completed)
              .length,
          };
        }),
      );

      setTaskCounts(
        Object.fromEntries(results.map(({ tagId, count }) => [tagId, count])),
      );
    }

    if (tags.length > 0) {
      void loadTaskCounts();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTaskCounts({});
    }
  }, [tags]);

  return (
    <div className="space-y-1">
      {tags.map((tag) => (
        <TagItem
          key={tag.id}
          tag={tag}
          taskCount={taskCounts[tag.id] ?? 0}
          selected={selectedTagId === tag.id}
          onUpdateTag={onUpdateTag}
          onDeleteTag={onDeleteTag}
        />
      ))}
    </div>
  );
}
