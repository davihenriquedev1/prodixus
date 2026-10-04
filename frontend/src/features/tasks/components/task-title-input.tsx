import { KeyboardEvent, useEffect, useState } from "react";
import { Task } from "../types/task";

interface TaskTitleInputProps {
  task: Task;
  disabled: boolean;
  onUpdate: (task: Task, title: string) => void;
}

export function TaskTitleInput({
  task,
  disabled,
  onUpdate,
}: TaskTitleInputProps) {
  const [value, setValue] = useState(task.title);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(task.title);
  }, [task.title]);

  function handleBlur() {
    onUpdate(task, value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }

    if (event.key === "Escape") {
      setValue(task.title);
      event.currentTarget.blur();
    }
  }

  return (
    <input
      type="text"
      disabled={disabled}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="min-w-0 flex-1 cursor-pointer outline-0 focus:outline-1 focus:outline-slate-600/50 truncate text-left text-sm p-1 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}
