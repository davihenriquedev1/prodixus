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
      className={`w-full resize-none rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm leading-6 text-foreground placeholder:text-subtle outline-none transition ${className}`}
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
