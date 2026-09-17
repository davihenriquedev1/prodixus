import { CheckCircle2, Circle } from "lucide-react";

const tasks = [
  {
    title: "Implement authentication",
    completed: false,
  },
  {
    title: "Configure database",
    completed: true,
  },
  {
    title: "Build dashboard",
    completed: false,
  },
];

export function RecentTasks() {
  return (
    <section className="space-y-3">
      <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
        Recent Tasks
      </div>

      <div className="bg-[#0D0F14]/40 border border-slate-800/80 rounded-xl divide-y divide-slate-800/50 overflow-hidden">
        {tasks.map((task) => (
          <div
            key={task.title}
            className="p-3.5 flex items-center justify-between hover:bg-slate-800/20 transition"
          >
            <div className="flex items-center gap-3">
              {task.completed ? (
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
              ) : (
                <Circle className="w-4 h-4 text-slate-500" />
              )}

              <span
                className={`text-xs ${
                  task.completed
                    ? "text-slate-500 line-through"
                    : "text-slate-200"
                }`}
              >
                {task.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
