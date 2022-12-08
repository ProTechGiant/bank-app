export const pluralize = (length: number, word: string, addition: string) => {
  return `${length} ${word}${length > 1 ? addition : ""}`;
};

export const spaceMap = {
  none: 0,
  xxxSmall: 4,
  xxSmall: 8,
  xSmall: 12,
  small: 16,
  medium: 20,
  large: 24,
  xLarge: 28,
  xxLarge: 32,
  xxxLarge: 36,
};

export const flexMap = {
  "1/1": 100,
  "1/2": 50,
  "1/3": 33.3333333,
  "2/3": 66.6666666,
  "1/4": 25,
  "2/4": 50,
  "3/4": 75,
  "1/5": 20,
  "2/5": 40,
  "3/5": 60,
  "4/5": 80,
  "1/6": 16.6666666,
  "2/6": 33.3333333,
  "3/6": 50,
  "4/6": 66.6666666,
  "5/6": 83.3333333,
};
