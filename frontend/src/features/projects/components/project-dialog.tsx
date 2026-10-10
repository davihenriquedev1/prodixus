"use client";

import { X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import type { CreateProjectData } from "@/features/projects/types/project";
import { EstimatedDurationUnit } from "@/types/estimated-duration-unit";
import { DateTimeInput } from "@/components/ui/date-time-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ColorInput } from "@/components/ui/color-input";
import { DEFAULT_ERROR_COLOR } from "@/utils/generate-random-colors";

interface ProjectDialogProps {
  open: boolean;
  folders: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmit: (data: CreateProjectData) => Promise<void>;
}

const DEFAULT_COLOR = "#64748B";

const DURATION_MULTIPLIERS: Record<EstimatedDurationUnit, number> = {
  minutes: 1,
  hours: 60,
  days: 1440,
  weeks: 10080,
};

export function ProjectDialog({
  open,
  folders,
  onClose,
  onSubmit,
}: ProjectDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [estimatedDurationUnit, setEstimatedDurationUnit] =
    useState<EstimatedDurationUnit>("hours");
  const [dueAt, setDueAt] = useState("");
  const [folderId, setFolderId] = useState("");
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_COLOR);
  const [accentColor, setAccentColor] = useState(DEFAULT_COLOR);
  const [errorColor, setErrorColor] = useState(DEFAULT_ERROR_COLOR);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isSubmitting, onClose]);

  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName("");
    setNotes("");
    setEstimatedDuration("");
    setEstimatedDurationUnit("hours");
    setDueAt("");
    setFolderId("");
    setPrimaryColor(DEFAULT_COLOR);
    setAccentColor(DEFAULT_COLOR);
    setErrorColor(DEFAULT_ERROR_COLOR);
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Informe o nome do projeto.");
      return;
    }

    let durationInMinutes: number | undefined;

    if (estimatedDuration.trim()) {
      const duration = Number(estimatedDuration);

      if (!Number.isInteger(duration) || duration < 0) {
        toast.error("Informe uma duração válida.");
        return;
      }

      durationInMinutes =
        duration * DURATION_MULTIPLIERS[estimatedDurationUnit];
    }

    let dueAtISO: string | undefined;

    if (dueAt) {
      const date = new Date(dueAt);

      if (Number.isNaN(date.getTime())) {
        toast.error("Informe um prazo válido.");
        return;
      }

      dueAtISO = date.toISOString();
    }

    const data: CreateProjectData = {
      name: trimmedName,
      primaryColor,
      accentColor,
      errorColor,
      ...(notes.trim() && { notes: notes.trim() }),
      ...(durationInMinutes !== undefined && {
        estimatedDuration: durationInMinutes,
      }),
      ...(dueAtISO && { dueAt: dueAtISO }),
      ...(folderId && { folderId }),
    };

    try {
      setIsSubmitting(true);
      await onSubmit(data);
      onClose();
    } catch {
      toast.error("Não foi possível criar o projeto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h2
              id="project-dialog-title"
              className="text-sm font-semibold text-slate-100"
            >
              Criar projeto
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Configure as informações iniciais do projeto.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fechar dialog"
            title="Fechar"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <div className="space-y-5 overflow-y-auto p-5">
            <div>
              <label
                htmlFor="create-project-name"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Nome <span className="text-red-400">*</span>
              </label>

              <Input
                id="create-project-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isSubmitting}
                placeholder="Nome do projeto"
                accentColor={accentColor}
                autoFocus
                required
              />
            </div>

            <div>
              <label
                htmlFor="create-project-notes"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Notas
              </label>

              <Textarea
                id="create-project-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                disabled={isSubmitting}
                rows={3}
                placeholder="Descreva o objetivo do projeto..."
                accentColor={accentColor}
              />
            </div>

            <div>
              <label
                htmlFor="create-project-folder"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Pasta
              </label>

              <Select
                id="create-project-folder"
                value={folderId}
                onChange={(event) => setFolderId(event.target.value)}
                disabled={isSubmitting}
                accentColor={accentColor}
                className="w-full"
              >
                <option value="">Sem pasta</option>

                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label
                htmlFor="create-project-duration"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Duração estimada
              </label>

              <div className="flex">
                <Input
                  id="create-project-duration"
                  type="number"
                  min="0"
                  step="1"
                  value={estimatedDuration}
                  onChange={(event) => setEstimatedDuration(event.target.value)}
                  disabled={isSubmitting}
                  placeholder="Duração"
                  accentColor={accentColor}
                  className="rounded-r-none"
                />

                <Select
                  value={estimatedDurationUnit}
                  onChange={(event) =>
                    setEstimatedDurationUnit(
                      event.target.value as EstimatedDurationUnit,
                    )
                  }
                  disabled={isSubmitting}
                  accentColor={accentColor}
                  className="w-auto rounded-l-none rounded-r-lg px-3 text-xs text-slate-400"
                >
                  <option value="minutes">Minutos</option>
                  <option value="hours">Horas</option>
                  <option value="days">Dias</option>
                  <option value="weeks">Semanas</option>
                </Select>
              </div>
            </div>

            <div>
              <label
                htmlFor="create-project-due-at"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Prazo
              </label>

              <DateTimeInput
                value={dueAt}
                onChange={setDueAt}
                disabled={isSubmitting}
                accentColor={accentColor}
              />
            </div>

            <div className="border-t border-slate-800 pt-5">
              <h3 className="mb-3 text-xs font-medium text-slate-400">
                Cores do projeto
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <ColorInput
                  label="Principal"
                  value={primaryColor}
                  onChange={setPrimaryColor}
                  disabled={isSubmitting}
                />

                <ColorInput
                  label="Destaque"
                  value={accentColor}
                  onChange={setAccentColor}
                  disabled={isSubmitting}
                />

                <ColorInput
                  label="Erro"
                  value={errorColor}
                  onChange={setErrorColor}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-slate-800 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer rounded-lg px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="cursor-pointer rounded-lg px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {isSubmitting ? "Criando..." : "Criar projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
