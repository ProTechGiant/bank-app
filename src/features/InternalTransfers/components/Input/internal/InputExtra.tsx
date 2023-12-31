import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InputExtraProps {
  errorText?: string;
  extraStart?: string;
  extraEnd?: string;
  testID?: string;
}

export default function InputExtra({ errorText, extraStart, extraEnd, testID }: InputExtraProps) {
  const isError = undefined !== errorText;

  const optionalLabelStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["4p"],
    flexDirection: "row",
    justifyContent: "space-between",
  }));

  return undefined !== extraStart || undefined !== extraEnd || isError ? (
    <View style={optionalLabelStyle}>
      <Typography.Text
        color={isError ? "errorBase" : "neutralBase"}
        size="caption1"
        weight="regular"
        testID={testID !== undefined ? `${testID}->ExtraStart` : undefined}>
        {isError ? errorText : extraStart}
      </Typography.Text>
      {undefined !== extraEnd ? (
        <Typography.Text
          color={isError ? "errorBase" : "neutralBase"}
          size="caption1"
          weight="regular"
          testID={testID !== undefined ? `${testID}->ExtraEnd` : undefined}>
          {extraEnd}
        </Typography.Text>
      ) : null}
    </View>
  ) : null;
}
