"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/features/auth/validators/auth.validator";
import { useAuth } from "@/features/auth/context/auth.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { z } from "zod";
import { toast } from "sonner";

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data.email, data.password);
      sessionStorage.setItem("show_welcome_message", "true");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid email or password.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-5"
    >
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Login
        </h1>

        <p className="text-sm text-muted">
          Entre com email e senha para utilizar o sistema.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-muted">
            Email
          </label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="text-xs"
            {...registerField("email")}
          />

          {errors.email && (
            <p className="text-xs text-danger">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-medium text-muted">
            Senha
          </label>

          <Input
            id="password"
            type="password"
            className="text-xs"
            autoComplete="current-password"
            {...registerField("password")}
          />

          {errors.password && (
            <p className="text-xs text-danger">{errors.password.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>

      <p className="text-center text-xs text-subtle">
        Ainda não tem uma conta?{" "}
        <Link
          href="/register"
          className="text-muted transition hover:text-foreground"
        >
          Crie uma
        </Link>
      </p>
    </form>
  );
}
