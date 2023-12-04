// @see https://www.figma.com/file/QOqqlaJOVnmvKjmRqIPryO/Croatia-Core-Theme?node-id=671%3A8706&t=7FQ3Qw5D8VeVyWdw-0
const palette = {
  // Core Brand Compliment
  "complimentBase+30": "#A31000",
  "complimentBase+20": "#D61500",
  "complimentBase+10": "#FF230A",
  complimentBase: "#FF523D",
  "complimentBase-10": "#FF7E70",
  "complimentBase-20": "#FFACA3",
  "complimentBase-30": "#FFD8D4",

  // Core Brand Support
  supportBase: "#BADADE",
  "supportBase-10": "#D6EBEC",
  "supportBase-15": "#E4F0F2",
  "supportBase-20": "#EEF6F7",
  "supportBase-30": "#F5F9FA",

  // Core Brand Neutral
  "neutralBase+30-12%": "rgba(30, 26, 37, 0.12)",
  "neutralBase+30": "#1E1A25",
  "neutralBase+20": "#423D4A",
  "neutralBase+10": "#605E6E",
  neutralBase: "#78758A",
  neutralBaseHover: "#2c2636",
  "neutralBase-10": "#9291A1",
  "neutralBase-20": "#ACABBA",
  "neutralBase-20-30%": "rgba(172, 171, 186, 0.3)",
  "neutralBase-30": "#D4D4DE",
  "neutralBase-40": "#F1F1F4",
  "neutralBase-50": "#F5F5F6",
  "neutralBase-60": "#FAFAFA",
  "neutralBase-60-60%": "rgba(252, 252, 252, 0.6)",

  // Core Brand Primary
  primaryBase: "#1E1A25",
  "primaryBase-10": "#014C3F",
  "primaryBase-20": "#016554",
  "primaryBase-30": "#02977E",
  "primaryBase-40": "#02B194",
  "primaryBase-50": "#02CAAA",
  "primaryBase-60": "#02E8C1",
  "primaryBase-70": "#39FDDC",
  "primaryBase-70-8%": "rgba(57, 253, 220, 0.08)",
  "primaryBase-80": "#86FEEA",
  "primaryBase-90": "#C7FEF5",

  // Core Brand Secondary Blue
  secondary_blueBase: "#6B9AD0",
  "secondary_blueBase-10": "#8EB8E7",
  "secondary_blueBase-20": "#B2D6FF",

  // Core Brand Secondary Purple
  secondary_purpleBase: "#917ADA",
  "secondary_purpleBase-10": "#B4A3ED",
  "secondary_purpleBase-20": "#D8CCFF",

  // Core Brand Secondary Pink
  "secondary_pinkBase-10": "#D6748E",
  "secondary_pinkBase-20": "#EB9BB0",
  "secondary_pinkBase-30": "#FFC2D2",

  // Core Brand Secondary Mint
  secondary_mintBase: "#89A44B",
  "secondary_mintBase-10": "#AAC861",
  "secondary_mintBase-20": "#CAED78",

  // Core Brand Secondary Yellow
  "secondary_yellowBase-10": "#B89F52",
  "secondary_yellowBase-20": "#D9BF6C",
  "secondary_yellowBase-30": "#FADE86",

  // Interaction
  interactionBase: "#005EA6",
  "interactionBase-10": "#669ECA",
  "interactionBase-20": "#99BFDB",
  "interactionBase-30": "#CCDFED",

  // Success
  successBase: "#1D9158",
  "successBase-10": "#3BD88C",
  "successBase-20": "#7BE5B1",
  "successBase-30": "#BBF2D7",

  // Error
  errorBase: "#D9070F",
  "errorBase-10": "#F94E54",
  "errorBase-20": "#EDA6A9",
  "errorBase-30": "#FAE5E6",
  "errorBase-40": "#FFEDED", // TODO: probably needs to be gone

  // Warning
  warningBase: "#D9B908",
  "warningBase-10": "#F9DF4E",
  "warningBase-20": "#F8E681",
  "warningBase-30": "#FBF0B1",

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
      xxlarge: 64,
      brand: 40,
      xlarge: 34,
      large: 28,
      medium: 22,
      small: 20,
    },
    // correspond directly with `sizes`
    _lineHeights: {
      xxlarge: 70,
      brand: 42,
      xlarge: 41,
      large: 34,
      medium: 28,
      small: 25,
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
      xxlarge: 64,
      brand: 40,
      xlarge: 34,
      large: 28,
      title1: 28,
      title2: 22,
      title3: 20,
      body: 17,
      callout: 16,
      footnote: 14,
      caption1: 12,
      caption2: 11,
    },
    // correspond directly with `sizes`
    _lineHeights: {
      xxlarge: 70,
      brand: 42,
      xlarge: 41,
      large: 34,
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
  "8p": 8,
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
  regular: 12,
  medium: 16,
  xlarge: 32,
  xxlarge: 64,
};

const padding = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

const shadow = {
  "shadow-1": {
    shadowColor: "rgba(0, 51, 76, 0.10)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
};

export { padding, palette, radii, shadow, spacing, typography };
