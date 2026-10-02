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
      className={`flex h-10 w-full p-2 gap-2 overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70 transition-all hover:border-slate-600/70 focus:bg-slate-700`}
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
        className="min-w-0 flex-1 bg-transparent text-xs text-slate-200 outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="w-px bg-slate-800" />

      <input
        type="time"
        value={time}
        onChange={(event) => onChange(`${date}T${event.target.value}`)}
        disabled={disabled}
        className="w-23 text-end flex-0 bg-transparent text-xs text-slate-200 outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}
