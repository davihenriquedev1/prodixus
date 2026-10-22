import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const navigation = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Como funciona", href: "#how-it-works" },
];

export function LandingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/6 bg-[#080B12]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-19 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          aria-label="Prodixus — página inicial"
          className="group flex items-center gap-3"
        >
          <Image
            src={"/logo-horiz-no-background.png"}
            width={140}
            height={140}
            alt={"logo-landing-page"}
          />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-9 md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white sm:inline-flex"
          >
            Entrar
          </Link>

          <Link
            href="/register"
            className="group inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/30"
          >
            Começar agora
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
