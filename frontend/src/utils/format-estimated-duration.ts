import { EstimatedDurationUnit } from "@/types/estimated-duration-unit";

export function formatEstimatedDuration(minutes?: number | null): {
  value: string;
  unit: EstimatedDurationUnit;
} {
  if (!minutes || minutes <= 0) {
    return {
      value: "",
      unit: "hours",
    };
  }

  if (minutes % (60 * 24 * 7) === 0) {
    return {
      value: String(minutes / (60 * 24 * 7)),
      unit: "weeks",
    };
  }

  if (minutes % (60 * 24) === 0) {
    return {
      value: String(minutes / (60 * 24)),
      unit: "days",
    };
  }

  if (minutes % 60 === 0) {
    return {
      value: String(minutes / 60),
      unit: "hours",
    };
  }

  return {
    value: String(minutes),
    unit: "minutes",
  };
}
