import { I18nManager, StyleSheet } from "react-native";

import { Stack } from "@/components";

import { HeaderBrandDivider } from "../assets/icons";

export default function MutualFundBrandDivider() {
  return (
    <Stack direction="vertical" style={styles.cardBrandDividerContainer}>
      <HeaderBrandDivider width="100%" height="100%" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  cardBrandDividerContainer: {
    aspectRatio: 7.22,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
