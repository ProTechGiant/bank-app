import times from "lodash/times";
import { StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import * as themeValues from "@/theme/values";

type ProgressIndicatorProps = {
  currentStep: number;
  totalStep: number;
  withEndStep?: boolean;
  color?: keyof typeof themeValues.palette;
};

export default function ProgressIndicator({ currentStep, totalStep, withEndStep, color }: ProgressIndicatorProps) {
  const progressBarStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-20"],
    flex: 1,
    height: 3,
    alignItems: "center",
  }));

  const progressBarActiveStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: color ?? theme.palette.complimentBase,
  }));

  const columnEndStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingLeft: theme.spacing["20p"],
  }));

  return (
    <Stack direction="horizontal" gap="4p" align="center" justify="center">
      {times(totalStep, (index: number) => (
        <View
          key={index}
          style={[
            progressBarStyle,
            index === totalStep - 1 && styles.progressBarLast,
            index <= currentStep - 1 && progressBarActiveStyle,
          ]}
        />
      ))}
      {withEndStep ? (
        <View style={columnEndStyle}>
          <Typography.Text color="neutralBase-30" size="callout">
            {currentStep}/{totalStep}
          </Typography.Text>
        </View>
      ) : null}
    </Stack>
  );
}

const styles = StyleSheet.create({
  progressBarLast: {
    marginRight: 0,
  },
});
