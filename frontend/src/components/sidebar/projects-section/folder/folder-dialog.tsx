"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface FolderDialogProps {
  open: boolean;
  title: string;
  initialName?: string;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export function FolderDialog({
  open,
  title,
  initialName = "",
  onClose,
  onSubmit,
}: FolderDialogProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(initialName);
  }, [open, initialName]);

  useEffect(() => {
    if (!open) return;

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

    try {
      setIsSubmitting(true);
      await onSubmit(trimmedName);
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
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-[#0D0F14] p-5 shadow-2xl">
        <h2 className="text-sm font-semibold text-slate-100">{title}</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nome da pasta"
            autoFocus
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-600"
          />

          <div className="flex justify-end gap-2">
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
