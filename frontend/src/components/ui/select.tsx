"use client";

import { useState, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  accentColor?: string;
}

export function Select({
  className = "",
  accentColor,
  onFocus,
  onBlur,
  ...props
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <select
      className={`w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm text-foreground outline-none transition ${className}`}
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
