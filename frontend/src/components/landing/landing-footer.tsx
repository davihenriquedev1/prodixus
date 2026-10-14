import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";

const footerNavigation = [
  {
    title: "Produto",
    links: [
      { label: "Funcionalidades", href: "#features" },
      { label: "Como funciona", href: "#how-it-works" },
    ],
  },
  {
    title: "Conta",
    links: [
      { label: "Entrar", href: "/login" },
      { label: "Criar conta", href: "/register" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-white/6 bg-[#080B12]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16 lg:py-16">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Prodixus — página inicial"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex size-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
                <Layers3 size={21} strokeWidth={1.8} aria-hidden="true" />
              </span>

              <span className="text-xl font-semibold tracking-tight text-white">
                Prodixus<span className="text-blue-400">.</span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Construa um fluxo de trabalho mais claro e concentre-se no que faz
              seu trabalho avançar.
            </p>

            <Link
              href="/register"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              Comece a organizar seu trabalho
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {footerNavigation.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-semibold text-white">
                {group.title}
              </h2>

              <ul className="mt-5 space-y-4">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/6 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Prodixus. Todos os direitos reservados.
          </p>

          <a href="#top" className="w-fit transition-colors hover:text-white">
            Voltar ao topo ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
