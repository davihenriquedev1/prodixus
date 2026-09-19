import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`w-full rounded-lg border border-slate-700 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-900 transition cursor-pointer hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
