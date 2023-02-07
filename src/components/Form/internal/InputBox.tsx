import { ControllerFieldState } from "react-hook-form";
import { Pressable, View, ViewStyle } from "react-native";

import { ErrorIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputLabel from "./InputLabel";

interface InputBoxProps {
  bordered?: boolean;
  children: React.ReactNode;
  extraStart?: string;
  extraEnd?: string;
  isEditable?: boolean;
  isFocused?: boolean;
  label?: string | null;
  multiline?: boolean;
  fieldState: ControllerFieldState;
  onPress?: () => void;
}

export default function InputBox({
  bordered = true,
  children,
  extraStart,
  extraEnd,
  isEditable = true,
  isFocused = false,
  label,
  multiline = false,
  fieldState,
  onPress,
}: InputBoxProps) {
  const isError = undefined !== fieldState?.error && fieldState.isTouched;

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: isError
        ? theme.palette["errorBase-40"]
        : isEditable
        ? theme.palette["neutralBase-50"]
        : theme.palette["neutralBase-30"],
      borderColor: isError
        ? theme.palette.errorBase
        : isFocused
        ? theme.palette["complimentBase"]
        : isEditable
        ? theme.palette["neutralBase-20"]
        : theme.palette["neutralBase-30"],
      borderRadius: theme.radii.extraSmall,
      borderWidth: bordered ? (isFocused || isError ? 2 : 1) : 0,
      flexDirection: "row",
      justifyContent: "space-between",
      flexGrow: 1,
      height: false == multiline ? 53 : undefined,
      minHeight: false !== multiline ? 74 : undefined,
      padding: theme.spacing["16p"] - (isFocused || isError ? 1 : 0),
    }),
    [bordered, isError, isEditable, isFocused, multiline]
  );

  const optionalLabelStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["4p"],
    flexDirection: "row",
    justifyContent: "space-between",
  }));

  const errorIconColor = useThemeStyles(theme => theme.palette.errorBase);

  return (
    <Pressable disabled={!isEditable} onPress={onPress}>
      {label && <InputLabel>{label}</InputLabel>}
      <View style={containerStyle}>
        <>
          {children}
          {undefined !== fieldState.error && fieldState.isTouched && (
            <ErrorIcon fill={errorIconColor} height={20} width={20} />
          )}
        </>
      </View>
      {(undefined !== extraStart || undefined !== extraEnd || isError) && (
        <View style={optionalLabelStyle}>
          <Typography.Text color={isError ? "errorBase" : "neutralBase"} size="caption1" weight="regular">
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {isError ? fieldState.error!.message : extraStart}
          </Typography.Text>
          {undefined !== extraEnd && (
            <Typography.Text color={isError ? "errorBase" : "neutralBase"} size="caption1" weight="regular">
              {extraEnd}
            </Typography.Text>
          )}
        </View>
      )}
    </Pressable>
  );
}
