import { TagItem } from "@/features/tags/components/tag-item";

export function TagsSection() {
  return (
    <section className="space-y-2">
      <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
        Tags
      </div>

      <div className="space-y-1 text-xs">
        <TagItem name="Urgent" color="red" />
        <TagItem name="In Progress" color="yellow" />
        <TagItem name="Blocked" color="gray" />
      </div>
    </section>
  );
}
