const ANSWER_PREFIXES = /^(what is|what's|who is|who's|whats|whos)\s+/i;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(ANSWER_PREFIXES, '')
    .replace(/^(a|an|the)\s+/i, '')
    .replace(/[^\w\s]/g, '')
    .trim();
}

export function fuzzyMatch(userAnswer: string, correctAnswer: string): boolean {
  return normalize(userAnswer) === normalize(correctAnswer);
}
