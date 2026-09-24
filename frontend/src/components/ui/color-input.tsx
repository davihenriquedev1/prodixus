interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function ColorInput({
  label,
  value,
  onChange,
  disabled,
}: ColorInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] text-slate-500">{label}</label>

      <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1.5">
        <input
          type="color"
          value={value || "#64748B"}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
        />

        <span className="text-xs text-slate-400">{value || "#64748B"}</span>
      </div>
    </div>
  );
}
