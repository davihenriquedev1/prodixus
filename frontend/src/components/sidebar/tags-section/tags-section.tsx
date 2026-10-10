import { Plus } from "lucide-react";
import { TagsSectionList } from "./tags-section-list";
import { Tag } from "@/features/tags/types/tag";

interface TagsSectionProps {
  tags: Tag[];
  isLoading: boolean;
  error: unknown;
  mutationError: boolean;
  selectedTagId: string | null;
  onCreateTag: () => void;
  onUpdateTag: (tag: Tag) => void;
  onDeleteTag: (tag: Tag) => void;
}

export function TagsSection({
  tags,
  isLoading,
  error,
  mutationError,
  selectedTagId,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}: TagsSectionProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Tags
        </span>

        <div className="flex items-center text-slate-500">
          <button
            type="button"
            onClick={onCreateTag}
            className="w-full flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {mutationError && (
        <div className="py-1 text-xs text-red-400">
          Não foi possível concluir a operação.
        </div>
      )}

      {isLoading ? (
        <div className="py-1 text-xs text-slate-500">Carregando...</div>
      ) : error ? (
        <div className="py-1 text-xs text-red-400">
          Não foi possível carregar as tags
        </div>
      ) : (
        <div className="text-xs">
          <TagsSectionList
            tags={tags}
            selectedTagId={selectedTagId}
            onCreateTag={onCreateTag}
            onUpdateTag={onUpdateTag}
            onDeleteTag={onDeleteTag}
          />
        </div>
      )}
    </section>
  );
}
