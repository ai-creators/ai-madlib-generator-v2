const BLANK_PATTERN = /__([a-zA-Z]+)__/g;

export function parseAdlibBlanks(text: string): string[] {
  return Array.from(text.matchAll(BLANK_PATTERN), (match) => match[1]!);
}

export function fillAdlibBlanks(text: string, answers: string[]): string {
  let index = 0;
  return text.replace(BLANK_PATTERN, () => {
    const answer = answers[index] ?? "";
    index += 1;
    return `**${answer}**`;
  });
}

export function articleFor(word: string): "a" | "an" {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}
