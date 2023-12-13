import { Dimensions, I18nManager, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeStyles } from "@/theme";

import { EllipseIcon } from "../assets/icons";
import BrandLogo from "../assets/icons/BrandLogo.svg";
import VisaKeyword from "../assets/icons/VisaKeyword.svg";
import { AIOtype } from "../constants";
import { fakeCardNumber } from "../mocks";
import { CardTypes } from "../types";

export default function PermanentCard() {
  const screenWidth = Dimensions.get("window").width;
  const { allInOneCardType } = useAuthContext();

  const isNeraCard = allInOneCardType === CardTypes.NERA;

  const containerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: 26,
    marginVertical: theme.spacing["20p"],
  }));
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "relative",
    padding: theme.spacing["20p"],
    width: 348,
    height: 212,
    borderRadius: theme.radii.regular,
    backgroundColor: isNeraCard ? theme.palette.complimentBase : theme.palette["neutralBase+30"],
    left: (screenWidth - 348) / 2 - 26,
    justifyContent: "space-between",
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
          <BrandLogo />
        </Stack>
        <Stack direction="horizontal" justify="space-between" align="center" style={[styles.fullWidth, styles.ltr]}>
          <Stack direction="horizontal" gap="12p" align="center" style={styles.ltr}>
            <Stack direction="horizontal" gap="4p">
              <EllipseIcon />
              <EllipseIcon />
              <EllipseIcon />
              <EllipseIcon />
            </Stack>
            <Typography.Text size="callout" weight="medium" color="neutralBase-60">
              {fakeCardNumber}
            </Typography.Text>
          </Stack>
          <VisaKeyword />
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
