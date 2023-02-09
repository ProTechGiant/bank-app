import { Control, FieldValues, Path, useController } from "react-hook-form";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import CurrencyInput from "@/components/CurrencyInput";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LargeCurrencyInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
}

export default function LargeCurrencyInput<T extends FieldValues>({ control, name }: LargeCurrencyInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const isError = fieldState.isTouched && undefined !== fieldState.error;
  const helperText = isError ? fieldState.error?.message : undefined;

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    // width of "SAR" plus the margin-left it has relative to the amount
    paddingLeft: theme.typography.text.sizes.body * 2 + styles.currency.marginLeft,
    marginVertical: theme.spacing["24p"],
  }));

  const textStyles = useThemeStyles<ViewStyle & TextStyle>(
    theme => ({
      color: isError ? theme.palette.errorBase : theme.palette.primaryBase,
      fontSize: 56, // not in core theme
      fontWeight: theme.typography.text.weights.medium,
      padding: 0,
      margin: 0,
      lineHeight: 67,
    }),
    [isError]
  );

  const helperTextStyles = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyles}>
      <View style={styles.container}>
        <CurrencyInput
          caretHidden
          onBlur={field.onBlur}
          onChange={field.onChange}
          style={textStyles}
          value={field.value}
        />
        <Typography.Text
          color={isError ? "errorBase" : "primaryBase"}
          size="body"
          weight="medium"
          style={styles.currency}>
          SAR
        </Typography.Text>
      </View>
      {undefined !== helperText && (
        <Typography.Text
          color={isError ? "errorBase" : "primaryBase"}
          size="body"
          weight="regular"
          style={helperTextStyles}>
          {helperText}
        </Typography.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  currency: {
    // not "themeable"
    marginLeft: 4,
    marginVertical: 8,
  },
});
