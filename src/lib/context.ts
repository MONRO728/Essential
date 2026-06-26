/**
 * Best-effort word-form matcher used by the Context Learning mode to blank
 * out the target word inside its example sentence. Examples sometimes use
 * an inflected form (plural, past tense, -ing) rather than the dictionary
 * form, so we try the common regular inflections before giving up.
 */
export function buildBlankSentence(word: string, sentence: string): { display: string; hasBlank: boolean } {
  const w = word.toLowerCase();
  const candidates = new Set<string>([w, `${w}s`, `${w}es`, `${w}d`, `${w}ed`, `${w}ing`]);
  if (w.endsWith('e')) {
    candidates.add(`${w.slice(0, -1)}ed`);
    candidates.add(`${w.slice(0, -1)}ing`);
  }
  if (w.endsWith('y')) {
    candidates.add(`${w.slice(0, -1)}ies`);
    candidates.add(`${w.slice(0, -1)}ied`);
  }

  const tokenRe = /[A-Za-z']+/g;
  let match: RegExpExecArray | null;
  while ((match = tokenRe.exec(sentence))) {
    if (candidates.has(match[0].toLowerCase())) {
      const start = match.index;
      const end = start + match[0].length;
      return { display: `${sentence.slice(0, start)}_____${sentence.slice(end)}`, hasBlank: true };
    }
  }

  return { display: sentence, hasBlank: false };
}
