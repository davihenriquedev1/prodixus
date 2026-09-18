"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/validators/auth.validator";
import { useAuth } from "@/features/auth/context/auth.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { z } from "zod";

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
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-5"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Welcome back
        </h1>

        <p className="text-sm text-slate-400">
          Sign in to continue to your workspace.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-slate-300">
            Email
          </label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...registerField("email")}
          />

          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-xs font-medium text-slate-300"
          >
            Password
          </label>

          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...registerField("password")}
          />

          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-slate-300 transition hover:text-white"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
