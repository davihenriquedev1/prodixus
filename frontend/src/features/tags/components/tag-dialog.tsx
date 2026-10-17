"use client";

import { useEffect, useState } from "react";
import type { SubmitEvent, MouseEvent } from "react";
import { createPortal } from "react-dom";
import { ColorInput } from "@/components/ui/color-input";
import { generateRandomColor } from "@/utils/generate-random-colors";
import type { Tag } from "../types/tag";

interface TagDialogProps {
  open: boolean;
  title: string;
  initialTag?: Tag | null;
  onClose: () => void;
  onSubmit: (data: { name: string; color: string }) => Promise<void>;
}

export function TagDialog({
  open,
  title,
  initialTag,
  onClose,
  onSubmit,
}: TagDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(initialTag?.name ?? "");

    if (initialTag) {
      setColor(initialTag.color ?? "");
      return;
    }

    setColor(generateRandomColor());
  }, [open, initialTag]);

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

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        name: trimmedName,
        color,
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-background/60 p-4"
      onMouseDown={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-xl border border-border bg-surface p-5 shadow-2xl">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-muted">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nome da tag"
              autoFocus
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground outline-none placeholder:text-subtle focus:border-primary"
            />
          </div>
          <div>
            <ColorInput
              label="Cor"
              value={color}
              onChange={setColor}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-3 py-2 text-xs text-muted hover:bg-surface-elevated cursor-pointer hover:text-foreground"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white cursor-pointer hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
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
