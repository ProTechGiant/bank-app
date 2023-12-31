import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ProgressBarProps {
  percentage: number;
  hideText: boolean;
}

export default function ProgressBar({ percentage, hideText }: ProgressBarProps) {
  const progressBarStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette.complimentBase,
      height: theme.spacing["4p"],
      borderRadius: theme.radii.small,
    }),
    [percentage]
  );

  const progressBarEndStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing["4p"],
    backgroundColor: theme.palette["neutralBase-60-60%"],
    borderRadius: theme.radii.small,
  }));

  const progressTextStyle = useThemeStyles<TextStyle>(
    theme => ({
      position: "absolute",
      left: `${percentage - 10 > 0 ? percentage - 15 : 0}%`,
      borderRadius: theme.radii.medium,
      zIndex: 1,
      paddingHorizontal: theme.spacing["12p"],
      backgroundColor: theme.palette.complimentBase,
    }),
    [percentage]
  );

  return (
    <View style={styles.container}>
      <View style={[progressBarStyle, { width: `${percentage}%` }]} />

      {!hideText && (
        <Typography.Text
          align="center"
          color={percentage === 100 ? "neutralBase-60" : "neutralBase+30"}
          size="footnote"
          weight="semiBold"
          style={progressTextStyle}>
          {percentage}%
        </Typography.Text>
      )}
      <View style={[progressBarEndStyle, { width: `${100 - percentage}%` }]} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
});
