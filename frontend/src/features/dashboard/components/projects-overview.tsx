import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    name: "Project Alpha",
    color: "cyan",
    progress: "75%",
    tasks: 7,
  },
  {
    name: "Project Beta",
    color: "purple",
    progress: "50%",
    tasks: 7,
  },
  {
    name: "Project Gamma",
    color: "amber",
    progress: "25%",
    tasks: 7,
  },
];

export function ProjectsOverview() {
  return (
    <section className="space-y-3">
      <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
        Your Projects
      </div>

      <div className="space-y-2">
        {projects.map((project) => (
          <div
            key={project.name}
            className="bg-[#0D0F14]/60 border border-slate-800/70 rounded-xl p-4 flex items-center justify-between hover:border-slate-600 transition group"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full bg-${project.color}-400`}
              />

              <span className="text-sm font-medium text-slate-200">
                {project.name}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${project.color}-400`}
                  style={{ width: project.progress }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{project.tasks} tasks</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
