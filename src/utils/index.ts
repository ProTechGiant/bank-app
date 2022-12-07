export const pluralize = (length: number, word: string, addition: string) => {
  return `${length} ${word}${length > 1 ? addition : ""}`;
};
