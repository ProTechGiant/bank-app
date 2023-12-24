import { Dimensions, I18nManager, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeStyles } from "@/theme";

import { BrandWhiteIcon, EllipseIcon, VisaWhiteIcon } from "../../assets/icons";
import BrandLogo from "../../assets/icons/BrandLogo.svg";
import VisaKeyword from "../../assets/icons/VisaKeyword.svg";
import { AIOtype } from "../../constants";
import { fakeCardNumber } from "../../mocks";
import { CardTypes, defaultStyleForCard } from "../../types";

interface PermanentCardProps {
  additionalStyle?: defaultStyleForCard;
  haveBorder?: boolean;
  cardType?: CardTypes;
}

const defaultStyle: defaultStyleForCard = {
  cardWidth: 348,
  cardHeight: 212,
  sizeWords: "callout",
  logoWidth: 90,
  logoHeight: 91,
  visaWidth: 60,
  visaHeight: 20,
};

export default function NormalVisaCard({
  additionalStyle = defaultStyle,
  haveBorder = false,
  cardType,
}: PermanentCardProps) {
  const screenWidth = Dimensions.get("window").width;
  const { allInOneCardType } = useAuthContext();

  const isNeraCard = cardType ? cardType === CardTypes.NERA : allInOneCardType === CardTypes.NERA;

  const containerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: 26,
    marginVertical: theme.spacing["20p"],
  }));
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "relative",
    padding: theme.spacing["20p"],
    width: additionalStyle.cardWidth,
    height: additionalStyle.cardHeight,
    borderRadius: theme.radii.regular,
    backgroundColor: isNeraCard ? theme.palette.complimentBase : theme.palette["neutralBase+30"],
    left: (screenWidth - additionalStyle.cardWidth!) / 2 - 26,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowColor: "#000",
    elevation: 5,

    justifyContent: "space-between",
    borderWidth: haveBorder && !isNeraCard ? 1 : 0,
    borderLeftColor: I18nManager.isRTL ? "rgba(255, 255, 255, 0.08)" : theme.palette.complimentBase,
    borderBottomColor: theme.palette.complimentBase,
    borderTopColor: "rgba(255, 255, 255, 0.25)",
    borderRightColor: I18nManager.isRTL ? theme.palette.complimentBase : "rgba(255, 255, 255, 0.08)",
  }));

  return (
    <View style={containerViewStyle}>
      <Stack direction="vertical" style={containerStyle} justify="space-between">
        <Stack direction="horizontal" style={[styles.fullWidth, styles.ltr]}>
          <Typography.Text color="neutralBase-40" weight="medium" size="footnote">
            {isNeraCard ? AIOtype.Nera : AIOtype.NERA_PLUS}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" justify="center" style={styles.fullWidth}>
          {isNeraCard ? (
            <BrandWhiteIcon width={additionalStyle.logoWidth} height={additionalStyle.logoHeight} />
          ) : (
            <BrandLogo width={additionalStyle.logoWidth} height={additionalStyle.logoHeight} />
          )}
        </Stack>
        <Stack direction="horizontal" justify="space-between" align="center" style={[styles.fullWidth, styles.ltr]}>
          <Stack direction="horizontal" gap="12p" align="center" style={styles.ltr}>
            <Stack direction="horizontal" gap="4p">
              <EllipseIcon />
              <EllipseIcon />
              <EllipseIcon />
              <EllipseIcon />
            </Stack>
            <Typography.Text size={additionalStyle.sizeWords} weight="medium" color="neutralBase-60">
              {fakeCardNumber}
            </Typography.Text>
          </Stack>
          {isNeraCard ? (
            <VisaWhiteIcon width={additionalStyle.visaWidth} height={additionalStyle.visaHeight} />
          ) : (
            <VisaKeyword width={additionalStyle.visaWidth} height={additionalStyle.visaHeight} />
          )}
        </Stack>
      </Stack>
    </View>
  );
}
const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
  ltr: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
});
