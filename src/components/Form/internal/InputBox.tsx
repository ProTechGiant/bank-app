import { FieldError } from "react-hook-form";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import { Theme, useThemeStyles } from "@/theme";

import InputExtra from "./InputExtra";
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
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  error?: FieldError;
  isTouched: boolean;
  onPress?: () => void;
  icon?: React.ReactElement;
  center?: boolean;
  hideExtra?: boolean;
  backgroundColor?: keyof Theme["palette"];
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
  center = true,
  hideExtra = false,
  numberOfLines,
  backgroundColor,
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
      borderRadius: theme.radii.small,
      borderWidth: bordered ? (isFocused || isError ? 2 : 1) : 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: center && !multiline ? "center" : "flex-start",
      flexGrow: 1,
      height: multiline === false ? SINGLE_LINE_INPUT_HEIGHT : undefined,
      minHeight:
        multiline !== false && numberOfLines !== undefined
          ? SINGLE_LINE_INPUT_HEIGHT + (numberOfLines - 1) * TEXT_LINE_HEIGHT
          : undefined,
      padding: theme.spacing["16p"] - (isFocused || isError ? 1 : 0),
    }),
    [bordered, isError, isEditable, isFocused, multiline, numberOfLines]
  );

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: theme.spacing["8p"],
  }));

  const errorIconColor = useThemeStyles(theme => theme.palette.errorBase);

  return (
    <Pressable disabled={!isEditable} onPress={onPress} style={[{ flexGrow: block ? 1 : 0 }, style]}>
      {label && <InputLabel>{label}</InputLabel>}
      <View style={[containerStyle, backgroundColor !== undefined && { backgroundColor: backgroundColor }]}>
        <>
          {icon !== undefined && <View style={iconStyle}>{icon}</View>}
          <View style={styles.flex}>{children}</View>
          {undefined !== error && isTouched && <ErrorFilledCircleIcon color={errorIconColor} height={20} width={20} />}
        </>
      </View>

      {!hideExtra ? <InputExtra extraStart={extraStart} extraEnd={extraEnd} error={error} isError={isError} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

const SINGLE_LINE_INPUT_HEIGHT = 58;
const TEXT_LINE_HEIGHT = 21;
