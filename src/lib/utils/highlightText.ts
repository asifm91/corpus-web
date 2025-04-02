export function highlightText(text: string, searchQuery: string): string {
  if (!searchQuery) return text;
  
  const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return text.replace(regex, '<mark class="bg-primary/20 text-base-content rounded px-0.5">$1</mark>');
} 