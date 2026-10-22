"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoginForm } from "@/features/auth/components/login-form";
import { useAuth } from "@/features/auth/context/auth.context";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <span className="text-sm text-muted-foreground">
          Verificando sua sessão...
        </span>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          aria-label="Prodixus — página inicial"
          className="mb-8 flex justify-center"
        >
          <Image
            src="/logo-vert-no-background.png"
            alt="Prodixus"
            width={124}
            height={124}
            className="object-contain"
          />
        </Link>
        <LoginForm />
      </div>
    </main>
  );
}
