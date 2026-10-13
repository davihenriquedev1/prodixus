import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Command,
  Layers3,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#080B12] pt-36 sm:pt-44">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-140 w-225 -translate-x-1/2 rounded-full bg-blue-600/12 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-size-[64px_64px] mask-[linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Eyebrow */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.07] px-4 py-2 text-xs font-medium tracking-wide text-blue-300 sm:text-sm">
            <Sparkles size={15} />
            Menos caos. Mais clareza. Mais progresso.
            <ArrowUpRight size={14} className="opacity-70" />
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.12] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            Seu trabalho merece
            <br className="hidden sm:block" />{" "}
            <span className="bg-linear-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              um lugar melhor.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            Reúna projetos, organize tarefas e acompanhe seu progresso em um só
            lugar. Tenha clareza sobre o que importa e avance sem perder o foco.
          </p>

          {/* CTA */}
          <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/30"
            >
              Organize seu trabalho
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="#product-preview"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/3 px-6 text-sm font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/6"
            >
              Conhecer a plataforma
              <ArrowDown size={16} className="text-slate-400" />
            </Link>
          </div>

          {/* Supporting points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-500 sm:text-sm">
            {[
              "Projetos organizados",
              "Tarefas sob controle",
              "Progresso visível",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check size={15} className="text-blue-400" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Product preview */}
        <div
          id="product-preview"
          className="relative mx-auto mt-16 max-w-6xl sm:mt-20"
        >
          <div className="pointer-events-none absolute -inset-5 rounded-4xl bg-blue-500/8 blur-3xl" />

          <div className="relative overflow-hidden rounded-t-2xl border border-white/10 bg-[#0D111B] shadow-2xl shadow-black/50 sm:rounded-t-3xl">
            {/* Window bar */}
            <div className="flex h-12 items-center justify-between border-b border-white/[0.07] px-4 sm:h-14 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-400/80" />
                <span className="size-2.5 rounded-full bg-amber-300/80" />
                <span className="size-2.5 rounded-full bg-emerald-400/80" />
              </div>

              <div className="hidden items-center gap-2 rounded-lg border border-white/6 bg-white/2.5 px-3 py-1.5 text-xs text-slate-500 sm:flex">
                <Command size={12} />
                Workspace / Overview
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="size-2 rounded-full bg-emerald-400" />
                Workspace
              </div>
            </div>

            <div className="grid min-h-90 grid-cols-1 sm:grid-cols-[190px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]">
              {/* Sidebar mockup */}
              <aside className="hidden border-r border-white/[0.07] p-4 sm:block">
                <div className="mb-8 flex items-center gap-2.5 px-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                    <Layers3 size={17} />
                  </span>
                  <span className="text-sm font-semibold text-white">
                    Workspace
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3 rounded-lg bg-blue-500/10 px-3 py-2.5 text-sm text-blue-300">
                    <LayoutDashboard size={16} />
                    Overview
                  </div>
                </div>

                <div className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Projects
                </div>

                <div className="space-y-3 px-3">
                  {[
                    { name: "Website redesign", color: "bg-blue-400" },
                    { name: "Product launch", color: "bg-violet-400" },
                    { name: "Personal", color: "bg-emerald-400" },
                  ].map((project) => (
                    <div
                      key={project.name}
                      className="flex items-center gap-2.5 text-xs text-slate-500"
                    >
                      <span className={`size-2 rounded-sm ${project.color}`} />
                      <Layers3 size={16} />
                      {project.name}
                    </div>
                  ))}
                </div>
              </aside>

              {/* Main dashboard mockup */}
              <div className="min-w-0 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Monday, October 12</p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                      Good morning.
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      Here&apos;s what&apos;s happening with your work.
                    </p>
                  </div>
                </div>

                {/* Summary cards */}
                <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-3">
                  {[
                    {
                      label: "Active projects",
                      value: "04",
                      detail: "Across your workspace",
                      color: "text-blue-400",
                    },
                    {
                      label: "Tasks completed",
                      value: "18",
                      detail: "Keep up the momentum",
                      color: "text-emerald-400",
                    },
                    {
                      label: "In progress",
                      value: "07",
                      detail: "Moving forward",
                      color: "text-violet-400",
                    },
                  ].map((card, index) => (
                    <div
                      key={card.label}
                      className={`${index === 2 ? "col-span-2 lg:col-span-1" : ""} rounded-xl border border-white/[0.07] bg-white/2 p-3.5 sm:p-4`}
                    >
                      <p className="text-xs text-slate-500">{card.label}</p>
                      <p
                        className={`mt-3 text-2xl font-semibold tracking-tight ${card.color}`}
                      >
                        {card.value}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-600 sm:text-xs">
                        {card.detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Task list */}
                <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.07] bg-white/1.5">
                  <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5">
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        Upcoming tasks
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500">
                        A little progress every day.
                      </p>
                    </div>

                    <span className="rounded-md border border-white/8 px-2 py-1 text-[10px] text-slate-400">
                      View all
                    </span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {[
                      {
                        title: "Finalize homepage design",
                        project: "Website redesign",
                        color: "bg-blue-400",
                        date: "Today",
                      },
                      {
                        title: "Review product requirements",
                        project: "Product launch",
                        color: "bg-violet-400",
                        date: "Tomorrow",
                      },
                      {
                        title: "Prepare weekly planning",
                        project: "Personal",
                        color: "bg-emerald-400",
                        date: "Oct 16",
                      },
                    ].map((task) => (
                      <div
                        key={task.title}
                        className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors "
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="size-4.25 shrink-0 rounded-full border border-slate-600" />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-slate-300 sm:text-sm">
                              {task.title}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500 sm:text-xs">
                              <span
                                className={`size-1.5 rounded-full ${task.color}`}
                              />
                              {task.project}
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 text-[10px] text-slate-500 sm:text-xs">
                          {task.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Caption */}
          <p className="mt-5 text-center text-xs text-slate-600">
            Uma visão mais clara do seu trabalho, do planejamento à execução.
          </p>
          <p className="mt-1 text-center text-xs text-slate-800">
            * imagem meramente ilustrativa
          </p>
        </div>
      </div>

      {/* Bottom transition */}
      <div className="mt-20 h-px bg-linear-to-r from-transparent via-white/10 to-transparent sm:mt-28" />
    </section>
  );
}
