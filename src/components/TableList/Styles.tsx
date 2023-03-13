import { StyleSheet } from "react-native";
import { ViewStyle } from "react-native/types";

import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

export const useInfoStyles = () => {
  const infoIconStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "flex-start",
    paddingHorizontal: theme.spacing["4p"],
  }));

  const infoDimensions = useThemeStyles(theme => theme.iconDimensions.createGoal.info);
  const infoColor = useThemeStyles(theme => theme.palette["neutralBase-10"]);

  const copyColor = useThemeStyles<string>(theme => theme.palette.complimentBase, []);

  const { height: chevronHeight, width: chevronWidth } = useThemeStyles(theme => theme.iconDimensions.chevronRight);
  const chevronColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"], []);

  const dateContainer = useThemeStyles<ViewStyle>(theme => ({
    marginRight: -theme.spacing["16p"],
    marginVertical: -theme.spacing["16p"],
  }));

  return {
    dateContainer,
    infoIconStyle,
    infoDimensions,
    infoColor,
    chevronColor,
    chevronHeight,
    chevronWidth,
    copyColor,
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  outerContainer: {
    elevation: 5,
    shadowColor: palette["neutralBase+30"],
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  rightComponent: {
    alignSelf: "center",
  },
});
