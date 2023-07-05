import times from "lodash/times";
import { StyleSheet, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import Typography from "../Typography";

type ProgressIndicatorProps = {
  currentStep: number;
  totalStep: number;
  withEndStep?: boolean;
};

export default function ProgressIndicator({ currentStep, totalStep, withEndStep }: ProgressIndicatorProps) {
  const progressBarStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    flex: 1,
    height: 3,
  }));

  const progressBarActiveStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["primaryBase-40"],
  }));

  const columnEndStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingLeft: theme.spacing["20p"],
  }));

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  progressBarLast: {
    marginRight: 0,
  },
});
