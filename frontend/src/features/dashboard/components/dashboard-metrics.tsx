import { CheckCircle2, Folder, ListTodo } from "lucide-react";

const metrics = [
  {
    label: "Projects",
    value: "04",
    icon: Folder,
  },
  {
    label: "Tasks",
    value: "12",
    icon: ListTodo,
  },
  {
    label: "Completed",
    value: "07",
    icon: CheckCircle2,
  },
];

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="bg-[#0D0F14]/70 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
              <Icon className="w-3.5 h-3.5" />
              <span>{metric.label}</span>
            </div>

            <div className="text-3xl font-extrabold text-slate-100">
              {metric.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
