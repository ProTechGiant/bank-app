// @see https://www.figma.com/file/QOqqlaJOVnmvKjmRqIPryO/Croatia-Core-Theme?node-id=671%3A8706&t=7FQ3Qw5D8VeVyWdw-0
const palette = {
  "complimentBase+30": "#7C0303",
  "complimentBase+20": "#A91F0A",
  "complimentBase+10": "#D9270D",
  complimentBase: "#F34C33",
  "complimentBase-10": "#F7896E",
  "complimentBase-20": "#FFAD99",
  "complimentBase-30": "#FFDDCC",

  supportBase: "#BADADE",
  "supportBase-10": "#DCECEE",
  "supportBase-20": "#EEF6F7",
  "supportBase-30": "#F5F9FA",

  "neutralBase+30": "#2E2E2E",
  "neutralBase+20": "#4C4C4C",
  "neutralBase+10": "#666666",
  neutralBase: "#808080",
  "neutralBase-10": "#999999",
  "neutralBase-20": "#B3B3B3",
  "neutralBase-20-30%": "rgba(179, 179, 179, 0.3)",
  "neutralBase-30": "#CCCCCC",
  "neutralBase-40": "#E6E6E6",
  "neutralBase-50": "#F5F5F5",
  "neutralBase-50-50%": "#FFFFFF7F", // TODO: can probably be removed soon
  "neutralBase-50-12%": "#FFFFFF1F", // TODO: check if needed soon
  "neutralBase-60": "#FAFAFA",

  primaryBase: "#002233",
  "primaryBase-10": "#00334C",
  "primaryBase-20": "#004466",
  "primaryBase-30": "#006E99",
  "primaryBase-40": "#00A0CC",
  "primaryBase-50": "#00C8FF",
  "primaryBase-60": "33D3FF",
  "primaryBase-70": "#5CDCFF",

  secondary_blueBase: "#004F99",
  "secondary_blueBase-10": "#0067C7",
  "secondary_blueBase-20": "#0084FF",

  secondary_purpleBase: "#8004F",
  "secondary_purpleBase-10": "#AD006B",
  "secondary_purpleBase-20": "#E5008E",

  "secondary_pinkBase-10": "#FF99B9",
  "secondary_pinkBase-20": "#FFCCDC",
  "secondary_pinkBase-30": "#FFE5ED",

  secondary_mintBase: "#47EBD8",
  "secondary_mintBase-10": "#92F3E8",
  "secondary_mintBase-20": "#D1FAF5",

  "secondary_yellowBase-10": "#FFE999",
  "secondary_yellowBase-20": "#FFF0B8",
  "secondary_yellowBase-30": "#FFFAE5",

  interactionBase: "#005EA6",
  "interactionBase-10": "#669ECA",
  "interactionBase-20": "#99BFDB",
  "interactionBase-30": "#CCDFED",

  "successBase+20": "#004536", // TOOD: update banner and remove
  successBase: "#00AC86",
  "successBase-10": "#66CDB6",
  "successBase-20": "#99DECF",
  "successBase-30": "#CCEEE7",

  "errorBase+20": "#562020", // TOOD: update banner and remove
  errorBase: "#C50707",
  "errorBase-10": "#E79696",
  "errorBase-20": "#EFB9B9",
  "errorBase-30": "#F7DCDC",
  "errorBase-40": "#FFEDED", // TODO: probably needs to be gone

  warningBase: "#FEB24F",
  "warningBase-10": "#FED195",
  "warningBase-20": "#FFE0B9",
  "warningBase-30": "#FFF0DC",

  // utility
  transparent: "transparent",
};

// @see https://www.figma.com/file/QOqqlaJOVnmvKjmRqIPryO/Croatia-Core-Theme?node-id=71%3A10210&t=7FQ3Qw5D8VeVyWdw-0
const typography = {
  header: {
    weights: {
      regular: "400",
      medium: "500",
      semiBold: "600",
      bold: "700",
      extraBold: "800",
    },
    sizes: {
      large: 40,
      medium: 32,
      small: 24,
    },
    // correspond directly with `sizes`
    _lineHeights: {
      large: 41,
      medium: 34,
      small: 28,
    },
  },
  text: {
    weights: {
      regular: "400" as const,
      medium: "500" as const,
      semiBold: "600" as const,
      bold: "700" as const,
    },
    sizes: {
      large: 34,
      title1: 28,
      title2: 22,
      title3: 20,
      body: 17,
      callout: 16,
      footnote: 13,
      caption1: 12,
      caption2: 11,
    },
    // correspond directly with `sizes`
    _lineHeights: {
      large: 41,
      title1: 34,
      title2: 28,
      title3: 25,
      body: 22,
      callout: 21,
      footnote: 18,
      caption1: 16,
      caption2: 13,
    },
  },
};

const spacing = {
  "4p": 4,
  "5p": 5,
  "8p": 8,
  "10p": 10,
  "12p": 12,
  "16p": 16,
  "20p": 20,
  "24p": 24,
  "32p": 32,
  "48p": 48,
  "64p": 64,
};

const radii = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 16,
  xlarge: 32,
  xxlarge: 64,
};

const iconDimensions = {
  link: 16,
  notifications: 21,
  reorderIcons: 23,
  accordian: 24,
  copy: {
    width: 19,
    height: 22,
  },
  locationPin: 40,
  clearIcon: 20,
  friendIcon: 53,
  settingsPage: 24,
  shareCopy: 30,
  info: 17,
  share: 16,
  tick: 18,
  largeTick: 66,
  notificationTick: 42,
  nationality: 14,
  faqSectionIcons: 16,
  searchTextInput: 16,
  referralInstruction: {
    width: 51,
    height: 37,
  },
  createGoal: {
    info: 20,
    question: 12,
  },
  chevronRight: {
    height: 12,
    width: 7.41,
  },
  close: 12,
  calendar: {
    width: 13,
    height: 14,
  },
  cardInfo: 20,
  hideIcon: {
    height: 22,
    width: 19.15,
  },
  showIcon: {
    height: 15,
    width: 22,
  },
  infoQuestionMark: {
    height: 13,
    width: 13,
  },
  checkIcon: {
    height: 27,
    width: 36,
  },
  threeDots: {
    width: 14,
    height: 4,
  },
  referralCopy: 16,
};

export { iconDimensions, palette, radii, spacing, typography };
