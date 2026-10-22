import Link from "next/link";
import { ArrowUpRight, Camera, MonitorPlay, Music2 } from "lucide-react";
import Image from "next/image";

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

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/prodixus/",
    icon: Camera,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@prodixus",
    icon: Music2,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@prodixusapp",
    icon: MonitorPlay,
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-white/6 bg-[#080B12]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12 lg:py-16">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Prodixus — página inicial"
              className="group inline-flex items-center gap-3"
            >
              <Image
                src={"/logo-horiz-no-background.png"}
                width={140}
                height={140}
                alt={"logo-landing-page"}
              />
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
          <nav aria-label="Redes sociais">
            <h2 className="text-sm font-semibold text-white">Redes sociais</h2>

            <ul className="mt-5 space-y-4">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Prodixus no ${label} (abre em nova aba)`}
                    className="group inline-flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <Icon
                      size={18}
                      aria-hidden="true"
                      className="transition-colors group-hover:text-blue-400"
                    />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
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
