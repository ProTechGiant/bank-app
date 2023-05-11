import times from "lodash/times";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ArrowLeftIcon } from "@/assets/icons";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import Typography from "../Typography";

type ProgressIndicatorProps = {
  currentStep: number;
  totalStep: number;
  withBackButton?: boolean;
  withEndStep?: boolean;
};

export default function ProgressIndicator({
  currentStep,
  totalStep,
  withBackButton,
  withEndStep,
}: ProgressIndicatorProps) {
  const navigation = useNavigation();

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const progressBarStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    flex: 1,
    height: 3,
  }));

  const progressBarActiveStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["primaryBase-40"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-30"]);

  const columnStartStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: theme.spacing["20p"],
  }));

  const columnEndStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingLeft: theme.spacing["20p"],
  }));

  return (
    <View style={styles.container}>
      {withBackButton ? (
        <View style={columnStartStyle}>
          <Pressable onPress={handleOnBackPress} style={styles.backButton}>
            <ArrowLeftIcon color={iconColor} />
          </Pressable>
        </View>
      ) : null}
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
  backButton: {
    transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }],
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  progressBarLast: {
    marginRight: 0,
  },
});
