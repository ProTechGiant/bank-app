import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InputExtraProps {
  errorText?: string;
  extraStart?: string;
  extraEnd?: string;
}

export default function InputExtra({ errorText, extraStart, extraEnd }: InputExtraProps) {
  const isError = undefined !== errorText;

  const optionalLabelStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["4p"],
    flexDirection: "row",
    justifyContent: "space-between",
  }));

  return undefined !== extraStart || undefined !== extraEnd || isError ? (
    <View style={optionalLabelStyle}>
      <Typography.Text color={isError ? "errorBase" : "neutralBase"} size="caption1" weight="regular">
        {isError ? errorText : extraStart}
      </Typography.Text>
      {undefined !== extraEnd ? (
        <Typography.Text color={isError ? "errorBase" : "neutralBase"} size="caption1" weight="regular">
          {extraEnd}
        </Typography.Text>
      ) : null}
    </View>
  ) : null;
}
