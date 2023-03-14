import { StyleSheet } from "react-native";
import { ViewStyle } from "react-native/types";

import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

export const useInfoStyles = () => {
  const infoIconStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "flex-start",
    paddingHorizontal: theme.spacing["4p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);
  const infoDimensions = useThemeStyles(theme => theme.iconDimensions.createGoal.info);
  const infoColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  const { height: chevronHeight, width: chevronWidth } = useThemeStyles(theme => theme.iconDimensions.chevronRight);

  const dateContainer = useThemeStyles<ViewStyle>(theme => ({
    marginRight: -theme.spacing["16p"],
    marginVertical: -theme.spacing["16p"],
  }));

  return {
    dateContainer,
    infoIconStyle,
    infoDimensions,
    infoColor,
    iconColor,
    chevronHeight,
    chevronWidth,
  };
};

export const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
  },
  container: {
    flex: 0.9,
  },
  icon: {
    alignSelf: "center",
  },
  label: {
    alignItems: "center",
    flexDirection: "row",
  },
  outerContainer: {
    elevation: 5,
    shadowColor: palette["neutralBase+30"],
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
