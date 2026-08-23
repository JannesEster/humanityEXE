export function clamp(value: number, min = 0, max = 100): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function clampStat(value: number): number {
  return clamp(value, 0, 100);
}
