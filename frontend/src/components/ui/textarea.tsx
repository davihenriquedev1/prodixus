"use client";

import { useState, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  accentColor?: string;
}

export function Textarea({
  className = "",
  accentColor,
  onFocus,
  onBlur,
  ...props
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <textarea
      className={`w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-sm leading-6 text-slate-100 placeholder:text-slate-600 outline-none transition resize-none ${
        className
      }`}
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
  );
}
