"use client";

import { X } from "lucide-react";
import { useEffect, useState, type FocusEvent } from "react";
import { toast } from "sonner";

import type {
  Project,
  UpdateProjectData,
} from "@/features/projects/types/project";
import { EstimatedDurationUnit } from "@/types/estimated-duration-unit";
import { formatEstimatedDuration } from "@/utils/format-estimated-duration";
import { formatDateTimeLocal } from "@/utils/format-datetime-local";
import { DateTimeInput } from "@/components/ui/date-time-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ColorInput } from "@/components/ui/color-input";
import { DEFAULT_ERROR_COLOR } from "@/utils/generate-random-colors";
import { useProjectMutations } from "../hooks/use-project-mutations";

interface ProjectSettingsProps {
  project: Project;
  onClose: () => void;
  onProjectUpdated: (project: Project) => void;
}

export function ProjectSettings({
  project,
  onClose,
  onProjectUpdated,
}: ProjectSettingsProps) {
  const [name, setName] = useState(project.name);
  const [notes, setNotes] = useState(project.notes ?? "");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [estimatedDurationUnit, setEstimatedDurationUnit] =
    useState<EstimatedDurationUnit>("hours");
  const [dueAt, setDueAt] = useState(formatDateTimeLocal(project.dueAt));
  const [primaryColor, setPrimaryColor] = useState(
    project.primaryColor ?? "#64748B",
  );
  const [accentColor, setAccentColor] = useState(
    project.accentColor ?? "#64748B",
  );
  const [errorColor, setErrorColor] = useState(
    project.errorColor ?? DEFAULT_ERROR_COLOR,
  );
  const [isSaving, setIsSaving] = useState(false);

  const { updateProjectMutation } = useProjectMutations();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(project.name);
    setNotes(project.notes ?? "");

    const duration = formatEstimatedDuration(project.estimatedDuration);

    setEstimatedDuration(duration.value);
    setEstimatedDurationUnit(duration.unit);
    setDueAt(formatDateTimeLocal(project.dueAt));
    setPrimaryColor(project.primaryColor ?? "#64748B");
    setAccentColor(project.accentColor ?? "#64748B");
    setErrorColor(project.errorColor ?? DEFAULT_ERROR_COLOR);
  }, [project]);

  async function saveField(data: UpdateProjectData) {
    try {
      setIsSaving(true);

      const projectUpdated = await updateProjectMutation.mutateAsync({
        projectId: project.id,
        data,
      });

      onProjectUpdated(projectUpdated);
    } catch {
      toast.error("Não foi possível salvar a alteração.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleNameBlur() {
    const value = name.trim();

    if (!value || value === project.name) {
      setName(project.name);
      return;
    }

    await saveField({ name: value });
  }

  async function handleNotesBlur() {
    const value = notes.trim();

    if (value === (project.notes ?? "")) {
      return;
    }

    await saveField({ notes: value || null });
  }

  async function handleEstimatedDurationBlur() {
    const value = estimatedDuration.trim();

    if (!value) {
      if (project.estimatedDuration === null) {
        return;
      }

      await saveField({ estimatedDuration: null });
      return;
    }

    const number = Number(value);

    if (!Number.isInteger(number) || number < 0) {
      const duration = formatEstimatedDuration(project.estimatedDuration);

      setEstimatedDuration(duration.value);
      setEstimatedDurationUnit(duration.unit);
      return;
    }

    const multipliers: Record<EstimatedDurationUnit, number> = {
      minutes: 1,
      hours: 60,
      days: 1440,
      weeks: 10080,
    };

    const duration = number * multipliers[estimatedDurationUnit];

    if (duration === project.estimatedDuration) {
      return;
    }

    await saveField({ estimatedDuration: duration });
  }

  function handleEstimatedDurationFocusOut(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget as Node | null;

    if (nextTarget && event.currentTarget.contains(nextTarget)) {
      return;
    }

    void handleEstimatedDurationBlur();
  }

  async function handleDueAtBlur() {
    const value = dueAt.trim();

    if (!value || value === "T") {
      if (project.dueAt === null) {
        return;
      }

      await saveField({ dueAt: null });
      return;
    }

    const [date, time] = value.split("T");
    const dateValue = new Date(`${date}T${time || "23:59"}`);

    if (Number.isNaN(dateValue.getTime())) {
      return;
    }

    const isoValue = dateValue.toISOString();

    if (isoValue === project.dueAt) {
      return;
    }

    await saveField({ dueAt: isoValue });
  }

  async function handleColorBlur(
    field: "primaryColor" | "accentColor" | "errorColor",
    value: string,
    originalValue: string | null,
  ) {
    if (!value || value === (originalValue ?? "")) {
      return;
    }

    await saveField({ [field]: value });
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-slate-800/80 px-4 py-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              className="text-sm font-semibold text-slate-100"
              style={{
                color: project.primaryColor ?? "#64748B",
              }}
            >
              Editar projeto
            </h2>

            <p className="mt-1 truncate text-xs text-slate-500">
              {project.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel"
            title="Fechar"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Main information */}
          <section className="space-y-4">
            <div>
              <label
                htmlFor="project-name"
                className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-500"
              >
                Nome
              </label>

              <Input
                id="project-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={handleNameBlur}
                disabled={isSaving}
                accentColor={project.accentColor ?? "#64748B"}
                placeholder="Nome do projeto"
              />
            </div>

            <div>
              <label
                htmlFor="project-notes"
                className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-500"
              >
                Notas
              </label>

              <Textarea
                id="project-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                onBlur={handleNotesBlur}
                disabled={isSaving}
                rows={6}
                placeholder="Adicione observações sobre este projeto..."
                accentColor={project.accentColor ?? "#64748B"}
              />
            </div>
          </section>

          <div className="h-px bg-slate-800/70" />

          {/* Project metadata */}
          <section className="space-y-4">
            <div>
              <label
                htmlFor="project-estimated-duration"
                className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-500"
              >
                Duração estimada
              </label>

              <div onBlur={handleEstimatedDurationFocusOut} className="flex">
                <Input
                  id="project-estimated-duration"
                  type="number"
                  min="0"
                  value={estimatedDuration}
                  onChange={(event) => setEstimatedDuration(event.target.value)}
                  disabled={isSaving}
                  placeholder="Duração"
                  accentColor={project.accentColor ?? "#64748B"}
                  className="rounded-r-none"
                />

                <Select
                  value={estimatedDurationUnit}
                  onChange={(event) =>
                    setEstimatedDurationUnit(
                      event.target.value as EstimatedDurationUnit,
                    )
                  }
                  disabled={isSaving}
                  accentColor={project.accentColor ?? "#64748B"}
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
                htmlFor="project-due-at"
                className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-500"
              >
                Prazo
              </label>

              <DateTimeInput
                value={dueAt}
                onChange={setDueAt}
                onBlur={handleDueAtBlur}
                disabled={isSaving}
                accentColor={project.accentColor ?? "#64748B"}
              />
            </div>
          </section>

          <div className="h-px bg-slate-800/70" />

          {/* Project colors */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Cores do projeto
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div
                onBlur={(event) => {
                  const nextTarget = event.relatedTarget as Node | null;

                  if (nextTarget && event.currentTarget.contains(nextTarget)) {
                    return;
                  }

                  void handleColorBlur(
                    "primaryColor",
                    primaryColor,
                    project.primaryColor,
                  );
                }}
              >
                <ColorInput
                  label="Principal"
                  value={primaryColor}
                  onChange={setPrimaryColor}
                  disabled={isSaving}
                />
              </div>

              <div
                onBlur={(event) => {
                  const nextTarget = event.relatedTarget as Node | null;

                  if (nextTarget && event.currentTarget.contains(nextTarget)) {
                    return;
                  }

                  void handleColorBlur(
                    "accentColor",
                    accentColor,
                    project.accentColor,
                  );
                }}
              >
                <ColorInput
                  label="Cor de destaque"
                  value={accentColor}
                  onChange={setAccentColor}
                  disabled={isSaving}
                />
              </div>

              <div
                onBlur={(event) => {
                  const nextTarget = event.relatedTarget as Node | null;

                  if (nextTarget && event.currentTarget.contains(nextTarget)) {
                    return;
                  }

                  void handleColorBlur(
                    "errorColor",
                    errorColor,
                    project.errorColor,
                  );
                }}
              >
                <ColorInput
                  label="Cor de erro"
                  value={errorColor}
                  onChange={setErrorColor}
                  disabled={isSaving}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Saving state */}
      {isSaving && (
        <div className="overflow-hidden border-t border-slate-800/80">
          <div className="px-5 py-2.5 text-[11px] text-slate-500">
            Salvando alterações...
          </div>
        </div>
      )}
    </div>
  );
}
