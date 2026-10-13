import {
  ArrowDownRight,
  ArrowRight,
  CheckCheck,
  FolderKanban,
  GitBranch,
  Layers3,
  ListChecks,
  MousePointer2,
  PanelsTopLeft,
  Tags,
  Target,
  Workflow,
} from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    title: "Projetos bem organizados",
    description:
      "Organize seu trabalho em projetos objetivos. Mantenha tarefas relacionadas juntas e saiba exatamente onde encontrar cada coisa.",
    iconColor: "text-blue-400",
    iconBackground: "bg-blue-400/10",
    gradient:
      "bg-gradient-to-br from-blue-500/[0.08] via-transparent to-transparent",
  },
  {
    icon: ListChecks,
    title: "Tarefas sob controle",
    description:
      "Transforme grandes objetivos em tarefas práticas. Acompanhe o progresso, defina prioridades e mantenha os próximos passos claros.",
    iconColor: "text-emerald-400",
    iconBackground: "bg-emerald-400/10",
    gradient:
      "bg-gradient-to-br from-emerald-500/[0.07] via-transparent to-transparent",
  },
  {
    icon: GitBranch,
    title: "Grandes objetivos, pequenas etapas",
    description:
      "Divida tarefas complexas em subtarefas menores e gerenciáveis, sem perder de vista o objetivo principal.",
    iconColor: "text-violet-400",
    iconBackground: "bg-violet-400/10",
    gradient:
      "bg-gradient-to-br from-violet-500/[0.07] via-transparent to-transparent",
  },
  {
    icon: Tags,
    title: "Informações sempre acessíveis",
    description:
      "Use etiquetas para categorizar tarefas, relacionar atividades e encontrar o que precisa sem perder tempo procurando.",
    iconColor: "text-amber-300",
    iconBackground: "bg-amber-300/10",
    gradient:
      "bg-gradient-to-br from-amber-400/[0.06] via-transparent to-transparent",
  },
];

const workflowSteps = [
  "Mantenha atividades relacionadas em um só lugar",
  "Divida tarefas complexas em etapas menores",
  "Acompanhe o progresso sem perder o contexto",
];

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#080B12] py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 size-96 rounded-full bg-blue-500/4 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              <span className="h-px w-6 bg-blue-400" />
              Feito para o seu fluxo de trabalho
            </div>

            <h2 className="text-3xl leading-tight font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Tudo o que você precisa.
              <br />
              <span className="text-slate-500">Sem o que atrapalha.</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
              Reúna projetos e tarefas em um único espaço para gastar menos
              tempo organizando e mais tempo fazendo o que realmente importa.
            </p>
          </div>

          <a
            href="#how-it-works"
            className="group inline-flex w-fit items-center gap-2 pb-1 text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Veja como funciona
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="text-blue-400 transition-transform group-hover:translate-x-1"
            />
          </a>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group relative isolate overflow-hidden rounded-2xl border border-white/8 bg-[#0D111B] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-[#101522]"
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 -z-10 ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="flex items-center justify-between">
                  <span
                    className={`flex size-12 items-center justify-center rounded-xl border border-white/6 ${feature.iconBackground} ${feature.iconColor}`}
                  >
                    <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                  </span>

                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-slate-700"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-8 text-lg font-semibold tracking-tight text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>

                <div className="mt-7 flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors group-hover:text-slate-300">
                  <span
                    aria-hidden="true"
                    className="h-px w-5 bg-slate-700 transition-all group-hover:w-8 group-hover:bg-blue-400"
                  />
                  Pensado para simplificar
                </div>
              </article>
            );
          })}
        </div>

        <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/8 bg-[#0D111B] lg:mt-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-blue-500/8 blur-[100px]"
          />

          <div className="relative grid gap-10 p-6 sm:p-9 lg:grid-cols-2 lg:items-center lg:gap-16 lg:p-12">
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/10 text-blue-400">
                <Workflow size={21} aria-hidden="true" />
              </div>

              <h3 className="mt-6 max-w-lg text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Da desorganização a um plano claro.
              </h3>

              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
                Seu trabalho tem uma estrutura. Os projetos dão direção, as
                tarefas transformam planos em ação e as subtarefas ajudam você a
                cuidar de cada detalhe, uma etapa de cada vez.
              </p>

              <ul className="mt-7 space-y-3">
                {workflowSteps.map((step) => (
                  <li
                    key={step}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                      <CheckCheck size={12} aria-hidden="true" />
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div
              id="how-it-works"
              className="relative mx-auto w-full max-w-md scroll-mt-28"
            >
              <div
                aria-hidden="true"
                className="absolute top-8 bottom-8 left-7 w-px bg-linear-to-b from-blue-400/50 via-violet-400/40 to-emerald-400/50"
              />

              <div className="space-y-4">
                <div className="relative ml-3 rounded-xl border border-blue-400/20 bg-[#111A2A] p-4 shadow-lg shadow-blue-950/20">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
                      <PanelsTopLeft size={18} aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">Projeto</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Redesign do site
                      </p>
                    </div>

                    <ArrowDownRight
                      size={17}
                      aria-hidden="true"
                      className="ml-auto shrink-0 text-blue-400"
                    />
                  </div>
                </div>

                <div className="relative ml-9 rounded-xl border border-violet-400/20 bg-[#151321] p-4 shadow-lg shadow-violet-950/10">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-violet-400">
                      <Target size={18} aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">Tarefa</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Reformular a página inicial
                      </p>
                    </div>

                    <ArrowDownRight
                      size={17}
                      aria-hidden="true"
                      className="ml-auto shrink-0 text-violet-400"
                    />
                  </div>
                </div>

                <div className="relative ml-16 rounded-xl border border-emerald-400/20 bg-[#101D1B] p-4 shadow-lg shadow-emerald-950/10">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                      <MousePointer2 size={18} aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">
                        Subtarefa
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        Criar o primeiro esboço
                      </p>
                    </div>

                    <CheckCheck
                      size={17}
                      aria-hidden="true"
                      className="ml-auto shrink-0 text-emerald-400"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Layers3 size={14} aria-hidden="true" />
                <span>Um espaço de trabalho integrado</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center text-center sm:mt-20">
          <p className="text-sm text-slate-500">
            Uma maneira melhor de organizar o que realmente importa.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-blue-400"
            />
            <span>Projetos</span>
            <span aria-hidden="true" className="text-slate-800">
              /
            </span>
            <span>Tarefas</span>
            <span aria-hidden="true" className="text-slate-800">
              /
            </span>
            <span>Progresso</span>
          </div>
        </div>
      </div>
    </section>
  );
}
