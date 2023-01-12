import { FieldMetaProps } from "formik";
import { Pressable, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputLabel from "./InputLabel";

interface InputBoxProps<T> {
  children: React.ReactNode;
  extraStart?: string;
  extraEnd?: string;
  isEditable?: boolean;
  isFocused?: boolean;
  label?: string;
  multiline?: boolean;
  meta: FieldMetaProps<T>;
  onPress?: () => void;
}

export default function InputBox<T>({
  children,
  extraStart,
  extraEnd,
  isEditable = true,
  isFocused = false,
  label,
  multiline = false,
  meta,
  onPress,
}: InputBoxProps<T>) {
  const isError = undefined !== meta?.error && meta.touched;

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
      borderWidth: isFocused ? 2 : 1,
      flexDirection: "row",
      justifyContent: "space-between",
      minHeight: multiline ? 74 : 53,
      padding: theme.spacing.medium - (isFocused ? 1 : 0),
    }),
    [isError, isFocused, multiline]
  );

  const optionalLabelStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginHorizontal: theme.spacing.medium,
      marginTop: theme.spacing.small / 2,
      flexDirection: "row",
      justifyContent: "space-between",
    }),
    []
  );

  return (
    <Pressable disabled={!isEditable} onPress={onPress}>
      {undefined !== label && <InputLabel>{label}</InputLabel>}
      <View style={containerStyle}>{children}</View>
      {(undefined !== extraStart || undefined !== extraEnd || isError) && (
        <View style={optionalLabelStyle}>
          <Typography.Text color={isError ? "errorBase" : "neutralBase"} size="caption1" weight="regular">
            {isError ? meta.error : extraStart}
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
