import { toRomaji } from "wanakana";

export function readingsToRomaji(readings: string[]): string[] {
  return readings.map((r) => toRomaji(r));
}
