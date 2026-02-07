/**
 * Text analysis utilities: word count, readability, etc.
 */

export function countWords(text) {
  if (!text?.trim()) return 0;
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

export function countChars(text) {
  return text ? text.length : 0;
}

/**
 * Approximate Flesch-Kincaid grade level
 */
export function getReadabilityScore(text) {
  if (!text?.trim()) return null;
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  if (words.length < 5) return null;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgWordsPerSentence = words.length / (sentences.length || 1);
  const avgSyllablesPerWord =
    words.reduce((acc, w) => acc + Math.max(1, w.length <= 3 ? 1 : Math.ceil(w.length / 3)), 0) / words.length;
  const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  return Math.max(1, Math.min(12, Math.round(gradeLevel)));
}
