"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/features/projects/types/project";
import { createPortal } from "react-dom";
import { EstimatedDurationUnit } from "@/types/estimated-duration-unit";
import { formatEstimatedDuration } from "@/utils/format-estimated-duration";
import { formatDateTimeLocal } from "@/utils/format-datetime-local";
import { convertToMinutes } from "@/utils/convert-to-minutes";
import { ColorInput } from "@/components/ui/color-input";
import {
  DEFAULT_ERROR_COLOR,
  generateRandomColor,
} from "@/utils/generate-random-colors";

interface ProjectDialogProps {
  open: boolean;
  title: string;
  initialProject?: Project | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    notes?: string;
    estimatedDuration?: number;
    dueAt?: string;
    primaryColor?: string;
    accentColor?: string;
    errorColor?: string;
  }) => Promise<void>;
}

export function ProjectDialog({
  open,
  title,
  initialProject,
  onClose,
  onSubmit,
}: ProjectDialogProps) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [estimatedDurationUnit, setEstimatedDurationUnit] =
    useState<EstimatedDurationUnit>("hours");
  const [dueAt, setDueAt] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [errorColor, setErrorColor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(initialProject?.name ?? "");
    setNotes(initialProject?.notes ?? "");

    const duration = formatEstimatedDuration(initialProject?.estimatedDuration);

    setEstimatedDuration(duration.value);
    setEstimatedDurationUnit(duration.unit);

    setDueAt(formatDateTimeLocal(initialProject?.dueAt));

    if (initialProject) {
      setPrimaryColor(initialProject.primaryColor ?? "");
      setAccentColor(initialProject.accentColor ?? "");
      setErrorColor(initialProject.errorColor ?? "");
      return;
    }

    setPrimaryColor(generateRandomColor());
    setAccentColor(generateRandomColor());
    setErrorColor(DEFAULT_ERROR_COLOR);
  }, [open, initialProject]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isSubmitting, onClose]);

  if (!open || !mounted) {
    return null;
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const durationInMinutes = convertToMinutes(
      Number(estimatedDuration),
      estimatedDurationUnit,
    );

    try {
      setIsSubmitting(true);

      await onSubmit({
        name: trimmedName,
        ...(notes.trim() && { notes: notes.trim() }),
        ...(estimatedDuration &&
          !Number.isNaN(durationInMinutes) && {
            estimatedDuration: durationInMinutes,
          }),
        ...(dueAt && {
          dueAt: new Date(dueAt).toISOString(),
        }),
        ...(primaryColor && { primaryColor }),
        ...(accentColor && { accentColor }),
        ...(errorColor && { errorColor }),
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-[#0D0F14] p-5 shadow-2xl">
        <h2 className="text-sm font-semibold text-slate-100">{title}</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Nome</label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nome do projeto"
              autoFocus
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-600"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Notas</label>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Notas sobre o projeto"
              rows={6}
              disabled={isSubmitting}
              className="w-full resize-none rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">
                Duração estimada
              </label>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={estimatedDuration}
                  onChange={(event) => setEstimatedDuration(event.target.value)}
                  placeholder="Duração"
                  disabled={isSubmitting}
                  className="min-w-0 flex-1 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-600"
                />

                <select
                  value={estimatedDurationUnit}
                  onChange={(event) =>
                    setEstimatedDurationUnit(
                      event.target.value as EstimatedDurationUnit,
                    )
                  }
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none cursor-pointer focus:border-slate-600"
                >
                  <option value="minutes">Minutos</option>
                  <option value="hours">Horas</option>
                  <option value="days">Dias</option>
                  <option value="weeks">Semanas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-slate-400">
                Prazo
              </label>

              <input
                type="datetime-local"
                value={dueAt}
                onChange={(event) => setDueAt(event.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs text-slate-400">Cores</label>

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

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-800/60 cursor-pointer hover:text-slate-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-900 cursor-pointer hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
