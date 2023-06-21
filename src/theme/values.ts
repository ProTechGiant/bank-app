// @see https://www.figma.com/file/QOqqlaJOVnmvKjmRqIPryO/Croatia-Core-Theme?node-id=671%3A8706&t=7FQ3Qw5D8VeVyWdw-0
const palette = {
  // Core Brand Compliment
  "complimentBase+30": "#7C0303",
  "complimentBase+20": "#BF0000",
  "complimentBase+10": "#E50000",
  complimentBase: "#FF371E",
  "complimentBase-10": "#F7896E",
  "complimentBase-20": "#FFAD99",
  "complimentBase-30": "#FFDDCC",

  // Core Brand Support
  supportBase: "#BADADE",
  "supportBase-10": "#D6EBEC",
  "supportBase-15": "#E4F0F2",
  "supportBase-20": "#EEF6F7",
  "supportBase-30": "#F5F9FA",

  // Core Brand Neutral
  "neutralBase+30": "#2E2E2E",
  "neutralBase+20": "#4C4C4C",
  "neutralBase+10": "#666666",
  neutralBase: "#808080",
  "neutralBase-10": "#999999",
  "neutralBase-20": "#B3B3B3",
  "neutralBase-20-30%": "rgba(179, 179, 179, 0.3)",
  "neutralBase-30": "#D9D9D9",
  "neutralBase-40": "#F2F2F2",
  "neutralBase-50": "#F5F5F5",
  "neutralBase-60": "#FAFAFA",
  "neutralBase-60-60%": "rgba(250, 250, 250, 0.6)",

  // Core Brand Primary
  primaryBase: "#002233",
  "primaryBase-10": "#00334C",
  "primaryBase-20": "#004466",
  "primaryBase-30": "#006E99",
  "primaryBase-40": "#00A0CC",
  "primaryBase-50": "#00C8FF",
  "primaryBase-60": "#33D3FF",
  "primaryBase-70": "#5DDBFE",
  "primaryBase-70-8%": "rgba(93, 219, 254, 0.08)",

  // Core Brand Secondary Blue
  secondary_blueBase: "#004487",
  "secondary_blueBase-10": "#0861CE",
  "secondary_blueBase-20": "#2C89E5",

  // Core Brand Secondary Purple
  secondary_purpleBase: "#890356",
  "secondary_purpleBase-10": "#A90066",
  "secondary_purpleBase-20": "#EA1B9B",

  // Core Brand Secondary Pink
  "secondary_pinkBase-10": "#FF88B6",
  "secondary_pinkBase-20": "#FFCCDC",
  "secondary_pinkBase-30": "#FFDEEB",

  // Core Brand Secondary Mint
  secondary_mintBase: "#00BCA5",
  "secondary_mintBase-10": "#92F3E8",
  "secondary_mintBase-20": "#CAFFF9",

  // Core Brand Secondary Yellow
  "secondary_yellowBase-10": "#E8D06B",
  "secondary_yellowBase-20": "#FBF1B9",
  "secondary_yellowBase-30": "#FFF8DC",

  // Interaction
  interactionBase: "#005EA6",
  "interactionBase-10": "#669ECA",
  "interactionBase-20": "#99BFDB",
  "interactionBase-30": "#CCDFED",

  // Success
  successBase: "#00AC86",
  "successBase-10": "#66CDB6",
  "successBase-20": "#99DECF",
  "successBase-30": "#CCEEE7",

  // Error
  errorBase: "#821717",
  "errorBase-10": "#E79696",
  "errorBase-20": "#EFB9B9",
  "errorBase-30": "#F7DCDC",
  "errorBase-40": "#FFEDED", // TODO: probably needs to be gone

  // Warning
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
      xxlarge: 64,
      large: 40,
      medium: 32,
      small: 24,
    },
    // correspond directly with `sizes`
    _lineHeights: {
      xxlarge: 70,
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
      xlarge: 40,
      large: 34,
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
      xlarge: 46,
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
  "14p": 14,
  "16p": 16,
  "18p": 18,
  "20p": 20,
  "24p": 24,
  "28p": 28,
  "30p": 30,
  "32p": 32,
  "37p": 37,
  "48p": 48,
  "56p": 56,
  "64p": 64,
  "67p": 67,
  "68p": 68,
  "73p": 73,
  "80p": 80,
  "100p": 100,
  "120p": 120,
  "30%": "30%",
  "40%": "40%",
  half: "50%",
  "85%": "85%",
  full: "100%",
};

const radii = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 16,
  xlarge: 32,
  xxlarge: 64,
};

export { palette, radii, spacing, typography };
