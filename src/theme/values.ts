// @see https://www.figma.com/file/QOqqlaJOVnmvKjmRqIPryO/Croatia-Core-Theme?node-id=671%3A8706&t=7FQ3Qw5D8VeVyWdw-0
const palette = {
  "complimentBase+30": "#331200",
  "complimentBase+20": "#662400",
  "complimentBase+10": "#993700",
  complimentBase: "#FF7512",
  "complimentBase-50%": "#FF751280",
  "complimentBase-40%": "#FFDECC66",
  "complimentBase-10": "#FF9D66",
  "complimentBase-20": "#FFBD99",
  "complimentBase-30": "#FFDECC",

  "neutralBase+30": "#000000",
  "neutralBase+20": "#121212",
  "neutralBase+10": "#12121",
  neutralBase: "#7D7D7D",
  "neutralBase-30%": "#7D7D7D4D",
  "neutralBase-10": "#A3A3A3",
  "neutralBase-20": "#CCCCCC",
  "neutralBase-20-30%": "#CCCCCC4D",
  "neutralBase-30": "#F4F4F4",
  "neutralBase-40": "#F2F2F2",
  "neutralBase-50": "#FFFFFF",
  "neutralBase-50-50%": "#FFFFFF7F",
  "neutralBase-50-12%": "#FFFFFF1F",

  "primaryBase+30": "#030311",
  "primaryBase+20": "#060622",
  "primaryBase+10": "#090833",
  primaryBase: "#080E53",
  "primaryBase-10": "#6F6E99",
  "primaryBase-20": "#9F9FBB",
  "primaryBase-30": "#CFCFDD",

  "interactionBase+30": "#001321",
  "interactionBase+20": "#002642",
  "interactionBase+10": "#003864",
  interactionBase: "#005EA6",
  "interactionBase-10": "#669ECA",
  "interactionBase-20": "#99BFDB",
  "interactionBase-30": "#CCDFED",

  "successBase+30": "#00221B",
  "successBase+20": "#004536",
  "successBase+10": "#006750",
  successBase: "#00AC86",
  "successBase-10": "#66CDB6",
  "successBase-20": "#99DECF",
  "successBase-30": "#CCEEE7",

  "errorBase+30": "#2B1010",
  "errorBase+20": "#562020",
  "errorBase+10": "#813030",
  errorBase: "#C50707",
  "errorBase-10": "#E79696",
  "errorBase-20": "#EFB9B9",
  "errorBase-30": "#F7DCDC",
  "errorBase-40": "#FFEDED",
  "warningBase+30": "#332410",
  "warningBase+20": "#664720",
  "warningBase+10": "#986B2F",
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
  locationPin: 40,
  clearIcon: 20,
  friendIcon: 53,
  settingsPage: 24,
  shareCopy: 30,
  share: 16,
  tick: 18,
  largeTick: 66,
  notificationTick: 42,
  globe: 20,
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
  threeDots: {
    width: 14,
    height: 4,
  },
};

export { iconDimensions, palette, radii, spacing, typography };
