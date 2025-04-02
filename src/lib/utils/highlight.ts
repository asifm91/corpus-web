interface FuseMatch {
  indices: number[][];
  key: string;
  value: string;
}

interface FuseResult {
  matches?: FuseMatch[];
}

export function highlightText(text: string, searchResult: FuseResult): string {
  if (!searchResult?.matches) return text;

  // Get matches only for the current text field
  const matches = searchResult.matches
    .filter((match: FuseMatch) => match.value === text)
    .flatMap((match: FuseMatch) => match.indices)
    .sort((a: number[], b: number[]) => a[0] - b[0]);

  // Merge overlapping or adjacent matches
  const mergedMatches = matches.reduce((acc: number[][], curr: number[]) => {
    if (acc.length === 0) return [curr];
    
    const last = acc[acc.length - 1];
    // If current match overlaps or is adjacent to previous match
    if (curr[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], curr[1]);
      return acc;
    }
    return [...acc, curr];
  }, []);

  let result = '';
  let lastIndex = 0;

  mergedMatches.forEach((match: number[]) => {
    const [start, end] = match;
    // Add text before match
    result += text.slice(lastIndex, start);
    // Add highlighted match
    const matchedText = text.slice(start, end + 1).trim();
    if (matchedText) {
      result += `<mark class="bg-primary/20 rounded px-0.5">${matchedText}</mark>`;
    }
    lastIndex = end + 1;
  });

  // Add remaining text
  result += text.slice(lastIndex);
  return result;
} 