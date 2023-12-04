import { ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

export const useInfoStyles = () => {
  const infoIconStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "flex-start",
    paddingHorizontal: theme.spacing["4p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.neutralBase);
  const infoColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  const dateContainer = useThemeStyles<ViewStyle>(theme => ({
    marginRight: -theme.spacing["16p"],
    marginVertical: -theme.spacing["16p"],
  }));

  return {
    dateContainer,
    infoIconStyle,
    infoColor,
    iconColor,
  };
};
