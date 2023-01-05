import { times } from "lodash";
import { StyleSheet, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

type ProgressIndicatorProps = {
  currentStep: number;
  totalStep: number;
};

const ProgressIndicator = ({ currentStep, totalStep }: ProgressIndicatorProps) => {
  const progressBarStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-20"],
      borderRadius: 3,
      flex: 1,
      height: 3,
      marginRight: 4,
    }),
    []
  );
  const progressBarActiveStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["tintBase"],
    }),
    []
  );

  return (
    <View
      accessibilityLabel={`Step ${currentStep} of ${totalStep}`}
      accessibilityRole="progressbar"
      style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  progressBarLast: {
    marginRight: 0,
  },
});

export default ProgressIndicator;
