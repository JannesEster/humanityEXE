export const endings = [
  {
    id: 'act1-placeholder',
    headline: 'TRIAL EXTENSION',
    body: 'The board has agreed a longer trial. What follows is not written yet. The year will move faster from here.',
  },
];

export function endingById(id) {
  for (const ending of endings) {
    if (ending.id === id) return ending;
  }
  return null;
}
