import { FieldError } from "react-hook-form";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

import { ErrorIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputLabel from "./InputLabel";

interface InputBoxProps {
  bordered?: boolean;
  block?: boolean;
  children: React.ReactNode;
  extraStart?: string;
  extraEnd?: string;
  isEditable?: boolean;
  isFocused?: boolean;
  label?: string | null;
  multiline?: boolean;
  style?: StyleProp<ViewStyle>;
  error?: FieldError;
  isTouched: boolean;
  onPress?: () => void;
  icon?: React.ReactElement;
}

export default function InputBox({
  bordered = true,
  block = true,
  children,
  extraStart,
  extraEnd,
  isEditable = true,
  isFocused = false,
  label,
  multiline = false,
  style,
  error,
  isTouched,
  onPress,
  icon,
}: InputBoxProps) {
  const isError = undefined !== error && isTouched;

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: isError
        ? theme.palette["errorBase-30"]
        : isEditable
        ? theme.palette["neutralBase-50"]
        : theme.palette["neutralBase-30"],
      borderColor: isError
        ? theme.palette.errorBase
        : isFocused
        ? theme.palette["primaryBase-40"]
        : isEditable
        ? theme.palette["neutralBase-20"]
        : theme.palette["neutralBase-30"],
      borderRadius: theme.radii.extraSmall,
      borderWidth: bordered ? (isFocused || isError ? 2 : 1) : 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexGrow: 1,
      height: multiline === false ? 53 : undefined,
      minHeight: multiline !== false ? 74 : undefined,
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

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: theme.spacing["8p"],
  }));

  const errorIconColor = useThemeStyles(theme => theme.palette.errorBase);

  return (
    <Pressable disabled={!isEditable} onPress={onPress} style={[{ flexGrow: block ? 1 : 0 }, style]}>
      {label && <InputLabel>{label}</InputLabel>}
      <View style={containerStyle}>
        <>
          {icon !== undefined && <View style={iconStyle}>{icon}</View>}
          {children}
          {undefined !== error && isTouched && <ErrorIcon color={errorIconColor} height={20} width={20} />}
        </>
      </View>
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
    </Pressable>
  );
}
