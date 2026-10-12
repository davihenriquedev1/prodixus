"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoaderCircle, LockKeyhole, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserProfile } from "@/features/user/hooks/use-user-profile";
import { useUserMutations } from "@/features/user/hooks/use-user-mutations";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/features/user/validators/user.validator";

import type { z } from "zod";
import { useAuth } from "@/features/auth/context/auth.context";

type ProfileFormData = z.infer<typeof updateProfileSchema>;
type PasswordFormData = z.infer<typeof changePasswordSchema>;

export default function UserAccountSettingsPage() {
  const { data: user, isLoading, isError } = useUserProfile();
  const { updateProfile, changePassword } = useUserMutations();
  const { logout } = useAuth();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      curPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, profileForm]);

  async function onProfileSubmit(data: ProfileFormData) {
    try {
      await updateProfile.mutateAsync(data);
      toast.success("Informações pessoais atualizadas.");
    } catch {
      toast.error("Não foi possível atualizar suas informações.");
    }
  }

  async function onPasswordSubmit(data: PasswordFormData) {
    try {
      await changePassword.mutateAsync({
        curPassword: data.curPassword,
        newPassword: data.newPassword,
      });

      toast.success("Senha alterada com sucesso. Faça login novamente");
      passwordForm.reset();
      await logout();
    } catch {
      toast.error(
        "Não foi possível alterar a senha. Verifique sua senha atual.",
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <LoaderCircle className="size-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-4">
        <h1 className="text-lg font-semibold text-slate-100">
          Configurações da conta
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Não foi possível carregar suas informações. Tente novamente.
        </p>
        <Button
          type="button"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-full p-4 ">
      <div className="">
        <header className="mb-8">
          <h1 className="text-lg font-semibold tracking-tight text-slate-100">
            Configurações da conta
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Gerencie suas informações pessoais e a segurança da sua conta.
          </p>
        </header>

        <div className="space-y-6">
          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-2">
                <UserRound className="size-5 text-slate-300" />
              </div>

              <div>
                <h2 className="text-sm font-medium text-slate-100">
                  Informações pessoais
                </h2>
                <p className="mt-px text-xs text-slate-400">
                  Atualize seu nome e endereço de e-mail.
                </p>
              </div>
            </div>

            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-xs font-medium text-slate-300"
                >
                  Nome
                </label>
                <Input
                  id="name"
                  autoComplete="name"
                  className="text-xs"
                  {...profileForm.register("name")}
                  aria-invalid={!!profileForm.formState.errors.name}
                />
                {profileForm.formState.errors.name && (
                  <p className="text-xs text-red-400">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-300"
                >
                  E-mail
                </label>
                <Input
                  id="email"
                  className="text-xs"
                  type="email"
                  autoComplete="email"
                  {...profileForm.register("email")}
                  aria-invalid={!!profileForm.formState.errors.email}
                />
                {profileForm.formState.errors.email && (
                  <p className="text-xs text-red-400">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end border-t border-slate-800 pt-4">
                <Button
                  type="submit"
                  disabled={
                    updateProfile.isPending || !profileForm.formState.isDirty
                  }
                >
                  {updateProfile.isPending && (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  )}
                  Salvar alterações
                </Button>
              </div>
            </form>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-2">
                <LockKeyhole className="size-5 text-slate-300" />
              </div>

              <div>
                <h2 className="text-sm font-medium text-slate-100">
                  Segurança
                </h2>
                <p className="mt-px text-xs text-slate-400">
                  Altere sua senha para manter sua conta protegida.
                </p>
              </div>
            </div>

            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label
                  htmlFor="curPassword"
                  className="text-xs font-medium text-slate-300"
                >
                  Senha atual
                </label>
                <Input
                  id="curPassword"
                  type="password"
                  className="text-xs"
                  autoComplete="current-password"
                  {...passwordForm.register("curPassword")}
                  aria-invalid={!!passwordForm.formState.errors.curPassword}
                />
                {passwordForm.formState.errors.curPassword && (
                  <p className="text-xs text-red-400">
                    {passwordForm.formState.errors.curPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-xs font-medium text-slate-300"
                >
                  Nova senha
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  className="text-xs"
                  autoComplete="new-password"
                  {...passwordForm.register("newPassword")}
                  aria-invalid={!!passwordForm.formState.errors.newPassword}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-red-400">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-300"
                >
                  Confirmar nova senha
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="text-xs"
                  autoComplete="new-password"
                  {...passwordForm.register("confirmPassword")}
                  aria-invalid={!!passwordForm.formState.errors.confirmPassword}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-400">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end border-t border-slate-800 pt-4">
                <Button type="submit" disabled={changePassword.isPending}>
                  {changePassword.isPending && (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  )}
                  Alterar senha
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
