import { cloneElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface GoldWalletCreatingBenefitProps {
  icon: React.ReactElement<SvgProps | IconProps>;
  description: string;
}
export default function GoldWalletCreatingBenefit({ icon, description }: GoldWalletCreatingBenefitProps) {
  const sectionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.spacing["16p"],
    marginBottom: theme.spacing["16p"],
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing["64p"],
    height: theme.spacing["64p"],
    borderRadius: theme.spacing["16p"],
    margin: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-40"],
    alignItems: "center",
    justifyContent: "center",
  }));

  return (
    <Stack direction="horizontal" style={sectionContainerStyle}>
      <View style={iconContainerStyle}>{cloneElement(icon, { width: 30, height: 30 })}</View>
      <Typography.Text style={styles.description} weight="semiBold">
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
