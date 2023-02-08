import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import CurrencyInput, { MaskedCurrencyInputProps } from "@/components/CurrencyInput";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LargeCurrencyInputProps extends Pick<MaskedCurrencyInputProps, "onChange" | "value"> {
  isError?: boolean;
  helperText?: string;
}

export default function LargeCurrencyInput({ isError, helperText, onChange, value }: LargeCurrencyInputProps) {
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
    <View>
      <View style={styles.container}>
        <CurrencyInput caretHidden onChange={onChange} style={textStyles} value={value} />
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
