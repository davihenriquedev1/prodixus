"use client";

import { Layers3 } from "lucide-react";
import type { Project } from "@/types/project";

interface ProjectItemProps {
  project: Project;
}

export function ProjectItem({ project }: ProjectItemProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800/40 hover:text-slate-100">
      <Layers3 className="w-3.5 h-3.5" />

      <span className="truncate">{project.name}</span>
    </div>
  );
}
