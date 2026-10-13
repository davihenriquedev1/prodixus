"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useUserSettings } from "@/features/user-settings/hooks/use-user-settings";
import { useUserSettingsMutations } from "@/features/user-settings/hooks/use-user-settings-mutations";
import {
  updateUserSettingsSchema,
  type UpdateUserSettingsFormData,
} from "@/features/user-settings/validators/user-settings.validator";

const themeOptions = [
  {
    value: "light",
    label: "Claro",
    description: "Utiliza o tema claro.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Escuro",
    description: "Utiliza o tema escuro.",
    icon: Moon,
  },
  {
    value: "system",
    label: "Sistema",
    description: "Segue a preferência do seu dispositivo.",
    icon: Monitor,
  },
] as const;

export default function Preferences() {
  const { data: settings, isLoading, isError, refetch } = useUserSettings();

  const updateSettings = useUserSettingsMutations();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<UpdateUserSettingsFormData>({
    resolver: zodResolver(updateUserSettingsSchema),
    defaultValues: {
      theme: "system",
    },
  });

  const selectedTheme = useWatch({
    control,
    name: "theme",
  });

  useEffect(() => {
    if (settings) {
      reset({ theme: settings.theme });
    }
  }, [settings, reset]);

  async function onSubmit(data: UpdateUserSettingsFormData) {
    try {
      await updateSettings.mutateAsync(data);
      toast.success("Preferências salvas com sucesso.");
      reset(data);
    } catch {
      toast.error("Não foi possível salvar suas preferências.");
    }
  }

  return (
    <div className="min-h-full w-full p-4">
      <header className="mb-8">
        <h1 className="text-lg font-semibold text-foreground">
          Preferências gerais
        </h1>

        <p className="mt-1 text-xs text-muted">
          Personalize a aparência e o comportamento da aplicação.
        </p>
      </header>

      {isLoading ? (
        <div
          className="rounded-xl border border-border bg-surface p-6"
          role="status"
        >
          <p className="text-sm text-subtle">Carregando suas preferências...</p>
        </div>
      ) : isError ? (
        <div
          className="rounded-xl border border-danger/30 bg-danger/5 p-6"
          role="alert"
        >
          <p className="text-xs text-danger">
            Não foi possível carregar suas preferências.
          </p>

          <Button type="button" className="mt-4" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <section className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-foreground">Tema</h2>

              <p className="mt-1 text-xs text-muted">
                Escolha como deseja visualizar a aplicação.
              </p>
            </div>

            <div className="space-y-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedTheme === option.value;

                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border px-3 py-3 transition-colors ${
                      isSelected
                        ? "border-primary/70 bg-primary/5"
                        : "border-border hover:border-subtle/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register("theme")}
                      className="sr-only"
                    />

                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "bg-surface-elevated text-muted"
                      }`}
                    >
                      <Icon size={20} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-foreground">
                        {option.label}
                      </span>

                      <span className="mt-1 block text-xs text-muted">
                        {option.description}
                      </span>
                    </span>

                    <span
                      className={`size-4 shrink-0 rounded-full border ${
                        isSelected
                          ? "border-[5px] border-primary"
                          : "border-subtle/50"
                      }`}
                      aria-hidden="true"
                    />
                  </label>
                );
              })}
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              disabled={!isDirty || updateSettings.isPending}
              onClick={() => reset({ theme: settings?.theme ?? "system" })}
            >
              Descartar alterações
            </Button>

            <Button
              type="submit"
              disabled={!isDirty || updateSettings.isPending}
            >
              {updateSettings.isPending ? "Salvando..." : "Salvar preferências"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
