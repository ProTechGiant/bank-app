import { times } from "lodash";
import { StyleSheet, View } from "react-native";

import { palette } from "@/theme/values";

type ProgressIndicatorProps = {
  currentStep: number;
  totalStep: number;
};

const ProgressIndicator = ({ currentStep, totalStep }: ProgressIndicatorProps) => {
  return (
    <View
      accessibilityLabel={`Step ${currentStep} of ${totalStep}`}
      accessibilityRole="progressbar"
      style={styles.container}>
      {times(totalStep, (index: number) => (
        <View
          key={index}
          style={[
            styles.progressBar,
            index === totalStep - 1 && styles.progressBarLast,
            index <= currentStep - 1 && styles.progressBarActive,
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
  progressBar: {
    backgroundColor: palette["neutralBase-20"],
    borderRadius: 3,
    flex: 1,
    height: 3,
    marginRight: 4,
  },
  progressBarActive: {
    backgroundColor: palette["tintBase"],
  },
  progressBarLast: {
    marginRight: 0,
  },
});

export default ProgressIndicator;
