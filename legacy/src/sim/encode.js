export function encodeChoiceInput(choiceId, disclosure) {
  if (disclosure === 'full' || disclosure === 'partial' || disclosure === 'minimal') {
    return `${choiceId}:${disclosure}`;
  }
  return choiceId;
}

export function encodeReplay(seed, inputs) {
  return `v1.${seed}.${inputs.join('.')}`;
}

export function decodeReplay(raw) {
  if (!raw) return null;
  let text = String(raw);
  if (text.startsWith('#')) text = text.slice(1);
  if (text.startsWith('r=')) text = text.slice(2);
  const parts = text.split('.');
  if (parts[0] !== 'v1' || parts.length < 3) return null;
  const seed = Number(parts[1]);
  if (!Number.isFinite(seed) || seed <= 0) return null;
  const inputs = parts.slice(2).filter(Boolean);
  if (!inputs.length) return null;
  return { seed, inputs };
}
