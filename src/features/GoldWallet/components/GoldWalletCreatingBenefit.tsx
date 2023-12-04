import { StyleSheet, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface GoldWalletCreatingBenefitProps {
  description: string;
}
export default function GoldWalletCreatingBenefit({ description }: GoldWalletCreatingBenefitProps) {
  const sectionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.spacing["16p"],
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase+30"],
    width: "100%",
  }));

  return (
    <Stack direction="horizontal" style={sectionContainerStyle} justify="center">
      <Typography.Text style={styles.description} align="center" weight="regular" color="neutralBase-60">
        {description}
      </Typography.Text>
    </Stack>
  );
}

const styles = StyleSheet.create({
  description: {
    flexShrink: 1,
    width: "50%",
  },
});
