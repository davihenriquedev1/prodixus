import { EstimatedDurationUnit } from "@/types/estimated-duration-unit";

export function convertToMinutes(
  value: number,
  unit: EstimatedDurationUnit,
): number {
  switch (unit) {
    case "minutes":
      return value;

    case "hours":
      return value * 60;

    case "days":
      return value * 60 * 24;

    case "weeks":
      return value * 60 * 24 * 7;
  }
}
