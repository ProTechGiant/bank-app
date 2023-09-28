import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";

import { getProgressColor } from "../utils";

interface ProgressBarProps {
  goalTimeAchievePercentage: number;
  goalPercentageAmount: number;
  textColor?: keyof Theme["palette"];
  style?: StyleProp<ViewStyle>;
  secondaryProgressColor?: keyof Theme["palette"];
}

export default function ProgressBar({
  goalTimeAchievePercentage,
  goalPercentageAmount,
  textColor,
  style,
  secondaryProgressColor,
}: ProgressBarProps) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette[secondaryProgressColor || "neutralBase-60-60%"],
      height: 6,
      flexBasis: "90%",
      borderRadius: theme.radii.small,
    }),
    [secondaryProgressColor]
  );

  const progressBarStyle = useThemeStyles<ViewStyle>(
    theme => ({
      ...getProgressColor(goalTimeAchievePercentage, goalPercentageAmount),
      height: "100%",
      borderRadius: theme.radii.small,
    }),
    [goalTimeAchievePercentage, goalPercentageAmount]
  );

  return (
    <Stack direction="horizontal" align="center" gap="4p" style={[styles.stackStyle, style]}>
      <View style={containerStyle}>
        <View style={[progressBarStyle, { width: `${goalTimeAchievePercentage}%` }]} />
      </View>

      <Typography.Text color={textColor ? textColor : "neutralBase-60"} size="footnote" weight="semiBold">
        {goalTimeAchievePercentage}%
      </Typography.Text>
    </Stack>
  );
}

const styles = StyleSheet.create({ stackStyle: { marginTop: 17 } });
