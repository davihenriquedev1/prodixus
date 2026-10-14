import { useState } from "react";

interface DateTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  accentColor: string;
  disabled?: boolean;
}

export function DateTimeInput({
  value,
  onChange,
  disabled = false,
  onBlur,
  accentColor,
}: DateTimeInputProps) {
  const [date = "", time = ""] = value.split("T");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className="flex h-10 w-full gap-2 overflow-hidden rounded-lg border border-border bg-surface-elevated p-2 transition-all hover:border-subtle focus-within:bg-surface"
      style={{
        borderColor: isFocused ? accentColor : undefined,
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => {
        if (
          event.relatedTarget &&
          event.currentTarget.contains(event.relatedTarget)
        ) {
          return;
        }

        setIsFocused(false);
        onBlur?.();
      }}
    >
      <input
        type="date"
        value={date}
        onChange={(event) => onChange(`${event.target.value}T${time}`)}
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="w-px bg-border" />

      <input
        type="time"
        value={time}
        onChange={(event) => onChange(`${date}T${event.target.value}`)}
        disabled={disabled}
        className="w-23 flex-0 bg-transparent text-end text-xs text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}
