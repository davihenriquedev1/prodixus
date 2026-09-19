"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/auth.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { z } from "zod";

import { registerSchema } from "@/validators/auth.validator";
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Create account
        </h1>

        <p className="text-sm text-slate-400">
          Create your account to get started.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-medium text-slate-300">
            Name
          </label>

          <Input
            id="name"
            type="text"
            autoComplete="name"
            {...registerField("name")}
          />

          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

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
            autoComplete="new-password"
            {...registerField("password")}
          />

          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-slate-300 transition hover:text-white"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
