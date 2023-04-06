import { ControllerFieldState, FieldError } from "react-hook-form";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InputExtraProps {
  extraStart?: string;
  extraEnd?: string;
  isError: boolean;
  error?: FieldError;
}

export default function InputExtra({ extraStart, extraEnd, isError, error }: InputExtraProps) {
  const optionalLabelStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["4p"],
    flexDirection: "row",
    justifyContent: "space-between",
  }));

  return (
    <>
      {(undefined !== extraStart || undefined !== extraEnd || isError) && (
        <View style={optionalLabelStyle}>
          <Typography.Text color={isError ? "errorBase" : "neutralBase"} size="caption1" weight="regular">
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {isError ? error!.message : extraStart}
          </Typography.Text>
          {undefined !== extraEnd && (
            <Typography.Text color={isError ? "errorBase" : "neutralBase"} size="caption1" weight="regular">
              {extraEnd}
            </Typography.Text>
          )}
        </View>
      )}
    </>
  );
}
