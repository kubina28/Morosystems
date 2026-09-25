export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function splitList(text: string): string[] {
  return text
    .split(',')
    .map(normalizeWhitespace)
    .filter((item) => item.length > 0);
}

export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
