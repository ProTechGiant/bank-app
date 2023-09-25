import { StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { getProgressColor } from "../utils";

interface ProgressBarProps {
  goalTimeAchievePercentage: number;
  goalPercentageAmount: number;
}

export default function ProgressBar({ goalTimeAchievePercentage, goalPercentageAmount }: ProgressBarProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60-60%"],
    height: 6,
    flexBasis: "90%",
    borderRadius: theme.radii.small,
  }));

  const progressBarStyle = useThemeStyles<ViewStyle>(theme => ({
    ...getProgressColor(goalTimeAchievePercentage, goalPercentageAmount),
    height: "100%",
    borderRadius: theme.radii.small,
  }));

  return (
    <Stack direction="horizontal" align="center" gap="4p" style={styles.stackStyle}>
      <View style={containerStyle}>
        <View style={[progressBarStyle, { width: `${goalTimeAchievePercentage}%` }]} />
      </View>

      <Typography.Text color="neutralBase-60" size="footnote" weight="semiBold">
        {goalTimeAchievePercentage}%
      </Typography.Text>
    </Stack>
  );
}

const styles = StyleSheet.create({ stackStyle: { marginTop: 17 } });
