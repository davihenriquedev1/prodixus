"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  accentColor?: string;
}

export function Input({
  type,
  className = "",
  accentColor,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="relative">
      <input
        type={isPassword && showPassword ? "text" : type}
        className={`w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition ${
          isPassword ? "pr-10" : ""
        } ${type === "number" ? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" : ""} ${className}`}
        style={{
          borderColor: isFocused ? accentColor : undefined,
        }}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        {...props}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
}
