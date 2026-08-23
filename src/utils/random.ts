export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function mixSeed(seed: number, salt: number): number {
  return (Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) + salt) >>> 0;
}

export function pickWeighted<T extends { weight?: number }>(
  items: T[],
  rng: () => number,
): T {
  const total = items.reduce((sum, item) => sum + (item.weight ?? 1), 0);
  let ticket = rng() * total;
  for (const item of items) {
    ticket -= item.weight ?? 1;
    if (ticket <= 0) return item;
  }
  return items[items.length - 1];
}

export function intInRange(min: number, max: number, rng: () => number): number {
  return min + Math.floor(rng() * (max - min + 1));
}
