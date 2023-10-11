export const extractNumber = (text: string): string | undefined => {
  const regex = /([\d.]+)/;
  const match = text.match(regex);
  return match ? match[1] : undefined;
};

export const extractText = (text: string): string | undefined => {
  const regex = /([\d.]+)\s(.+)/;
  const match = text.match(regex);
  return match ? match[2] : undefined;
};
