"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/auth.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { z } from "zod";

import { registerSchema } from "@/features/auth/validators/auth.validator";
import { toast } from "sonner";

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await register(data.name, data.email, data.password);

      router.push("/dashboard");
    } catch {
      toast.error("Unable to create account.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-5"
    >
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Registro
        </h1>

        <p className="text-sm text-muted">Crie sua conta para começar.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-medium text-muted">
            Nome
          </label>

          <Input
            id="name"
            type="text"
            autoComplete="name"
            className="text-xs"
            {...registerField("name")}
          />

          {errors.name && (
            <p className="text-xs text-danger">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-muted">
            Email
          </label>

          <Input
            id="email"
            type="email"
            className="text-xs"
            autoComplete="email"
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
            autoComplete="new-password"
            {...registerField("password")}
          />

          {errors.password && (
            <p className="text-xs text-danger">{errors.password.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registrando..." : "Criar conta"}
      </Button>

      <p className="text-center text-xs text-subtle">
        Já possui uma conta?{" "}
        <Link
          href="/login"
          className="text-muted transition hover:text-foreground"
        >
          Faça login
        </Link>
      </p>
    </form>
  );
}
