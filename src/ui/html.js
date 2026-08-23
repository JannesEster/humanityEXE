export function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function formatShown(shown) {
  const parts = [];
  for (const [key, delta] of Object.entries(shown || {})) {
    const sign = delta > 0 ? '+' : '';
    parts.push(`${key} ${sign}${delta}`);
  }
  return parts.join(', ');
}
