"use client";

import { X } from "lucide-react";
import { useEffect, useState, type FocusEvent } from "react";

import { updateTask } from "@/features/tasks/services/task.service";
import type { Task } from "@/features/tasks/types/task";
import { EstimatedDurationUnit } from "@/types/estimated-duration-unit";
import { formatEstimatedDuration } from "@/utils/format-estimated-duration";
import { formatDateTimeLocal } from "@/utils/format-datetime-local";
import { DateTimeInput } from "@/components/ui/date-time-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

interface TaskSettingsProps {
  task: Task;
  onClose: () => void;
  onTaskUpdated: (task: Task) => void;
  accentColor: string;
  primaryColor: string;
  errorColor: string;
}

export function TaskSettings({
  task,
  onClose,
  onTaskUpdated,
  primaryColor,
  accentColor,
}: TaskSettingsProps) {
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes ?? "");
  const [priority, setPriority] = useState(String(task.priority));
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [estimatedDurationUnit, setEstimatedDurationUnit] =
    useState<EstimatedDurationUnit>("minutes");
  const [startAt, setStartAt] = useState(task.startAt ?? "");
  const [dueAt, setDueAt] = useState(task.dueAt ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(task.title);
    setNotes(task.notes ?? "");
    setPriority(String(task.priority));

    const duration = formatEstimatedDuration(task.estimatedDuration);

    setEstimatedDuration(duration.value);
    setEstimatedDurationUnit(duration.unit);

    setStartAt(formatDateTimeLocal(task.startAt));
    setDueAt(formatDateTimeLocal(task.dueAt));
    console.log("startAt:", task.startAt);
    console.log("dueAt:", task.dueAt);
    console.log("formatted startAt:", formatDateTimeLocal(task.startAt));
    console.log("formatted dueAt:", formatDateTimeLocal(task.dueAt));
  }, [task]);

  async function saveField(data: Parameters<typeof updateTask>[2]) {
    try {
      setIsSaving(true);

      const updatedTask = await updateTask(task.projectId, task.id, data);

      onTaskUpdated(updatedTask);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTitleBlur() {
    const value = title.trim();

    if (!value || value === task.title) {
      setTitle(task.title);
      return;
    }

    await saveField({ title: value });
  }

  async function handleNotesBlur() {
    const value = notes.trim();

    if (value === (task.notes ?? "")) {
      return;
    }

    await saveField({
      notes: value || undefined,
    });
  }

  async function handlePriorityBlur() {
    const value = Number(priority);

    if (!Number.isInteger(value) || value < 0 || value === task.priority) {
      setPriority(String(task.priority));
      return;
    }

    await saveField({ priority: value });
  }

  async function handleEstimatedDurationBlur() {
    const value = estimatedDuration.trim();

    if (!value) {
      if (task.estimatedDuration === null) {
        return;
      }

      await saveField({
        estimatedDuration: undefined,
      });

      return;
    }

    const number = Number(value);

    if (!Number.isInteger(number) || number < 0) {
      const duration = formatEstimatedDuration(task.estimatedDuration);

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

    if (duration === task.estimatedDuration) {
      return;
    }

    await saveField({
      estimatedDuration: duration,
    });
  }

  function handleEstimatedDurationFocusOut(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget as Node | null;

    if (nextTarget && event.currentTarget.contains(nextTarget)) {
      return;
    }

    void handleEstimatedDurationBlur();
  }

  async function handleStartAtBlur() {
    const value = startAt.trim();

    if (!value || value === "T") {
      if (task.startAt === null) {
        return;
      }

      await saveField({
        startAt: undefined,
      });

      return;
    }

    const [date, time] = value.split("T");

    const isoValue = new Date(`${date}T${time || "00:00"}`).toISOString();

    await saveField({
      startAt: isoValue,
    });
  }

  async function handleDueAtBlur() {
    const value = dueAt.trim();

    if (!value || value === "T") {
      if (task.dueAt === null) {
        return;
      }

      await saveField({
        dueAt: undefined,
      });

      return;
    }

    const [date, time] = value.split("T");

    const isoValue = new Date(`${date}T${time || "23:59"}`).toISOString();

    await saveField({
      dueAt: isoValue,
    });
  }

  return (
    <div
      className="flex h-full flex-col"
      style={{
        backgroundImage: `
					linear-gradient(
						90deg,
						${primaryColor}08 0%,
						${primaryColor}10 45%,
						${primaryColor}12 100%
					)
				`,
      }}
    >
      {/* Header */}
      <div className="border-b border-slate-800/80 py-2 px-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-100">
              Editar tarefa
            </h2>

            <p className="mt-1 truncate text-xs text-slate-500">{task.title}</p>
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
                htmlFor="task-title"
                className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-500"
              >
                Título
              </label>

              <Input
                id="task-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={handleTitleBlur}
                disabled={isSaving}
                accentColor={accentColor}
                placeholder="Título da tarefa"
              />
            </div>

            <div>
              <label
                htmlFor="task-notes"
                className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-500"
              >
                Notas
              </label>

              <Textarea
                id="task-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                onBlur={handleNotesBlur}
                disabled={isSaving}
                rows={6}
                placeholder="Adicione observações sobre esta tarefa..."
                accentColor={accentColor}
              />
            </div>
          </section>

          <div className="h-px bg-slate-800/70" />

          {/* Task metadata */}
          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="task-priority"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-500"
                >
                  Prioridade
                </label>

                <Input
                  id="task-priority"
                  type="number"
                  min="0"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  onBlur={handlePriorityBlur}
                  disabled={isSaving}
                  accentColor={accentColor}
                />
              </div>

              <div onBlur={handleEstimatedDurationFocusOut}>
                <label
                  htmlFor="task-estimated-duration"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-500"
                >
                  Duração
                </label>

                <div className="flex">
                  <Input
                    id="task-estimated-duration"
                    type="number"
                    min="0"
                    value={estimatedDuration}
                    onChange={(event) =>
                      setEstimatedDuration(event.target.value)
                    }
                    disabled={isSaving}
                    placeholder="10"
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
                    disabled={isSaving}
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="task-start-at"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-500"
                >
                  Início
                </label>

                <DateTimeInput
                  value={startAt}
                  onChange={setStartAt}
                  onBlur={handleStartAtBlur}
                  disabled={isSaving}
                  accentColor={accentColor}
                />
              </div>

              <div>
                <label
                  htmlFor="task-due-at"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-slate-500"
                >
                  Prazo
                </label>
                <DateTimeInput
                  value={dueAt}
                  onChange={setDueAt}
                  onBlur={handleDueAtBlur}
                  disabled={isSaving}
                  accentColor={accentColor}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Saving state */}
      {isSaving && (
        <div
          className={`overflow-hidden border-t border-slate-800/80 transition-all`}
        >
          <div className="px-5 py-2.5 text-[11px] text-slate-500">
            Salvando alterações...
          </div>
        </div>
      )}
    </div>
  );
}
