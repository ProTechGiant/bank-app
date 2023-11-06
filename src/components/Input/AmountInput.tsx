import { Control, FieldValues, Path, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { UnstyledCurrencyInput } from "@/components/Input";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import * as theme from "@/theme/values";
import { formatCurrency } from "@/utils";
interface AmountInputProps<T extends FieldValues> {
  autoFocus?: boolean;
  control: Control<T>;
  currentBalance: number;
  isError?: boolean;
  maxLength?: number;
  name: Path<T>;
  hideBalanceError?: boolean;
  showConvertedBalance?: boolean;
  testID?: string;
  AmountType?: string;
  inputColor?: keyof typeof theme.palette;
}

export function AmountInput<T extends FieldValues>({
  autoFocus,
  control,
  currentBalance,
  isError,
  maxLength,
  name,
  hideBalanceError,
  testID,
  AmountType,
  inputColor = "primaryBase-40",
  showConvertedBalance = true,
}: AmountInputProps<T>) {
  const { t } = useTranslation();
  const { field } = useController({ control, name });

  const fontSize =
    field.value !== undefined && String(field.value).length > 10
      ? "s"
      : field.value !== undefined && String(field.value).length > 7
      ? "m"
      : "l";

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    alignItems: "flex-end",
    flexDirection: "row",
  }));

  const textStyles = useThemeStyles<ViewStyle & TextStyle>(
    theme => ({
      color: isError ? theme.palette.errorBase : theme.palette[inputColor],
      fontWeight: theme.typography.text.weights.medium,
      padding: 0,
      margin: 0,
      alignSelf: "center",
    }),
    [isError]
  );

  const currencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginLeft: theme.spacing["4p"],
    marginVertical: theme.spacing["12p"],
  }));

  const selectionStyles = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <>
      {showConvertedBalance ? (
        <Typography.Text
          color={isError && !hideBalanceError ? "errorBase" : "neutralBase-10"}
          size="callout"
          testID={testID !== undefined ? `${testID}-CurrentBalance` : undefined}>
          {t("InternalTransfers.TransferAmountInput.balance") + formatCurrency(currentBalance, "SAR")}
        </Typography.Text>
      ) : null}
      <View style={containerStyles}>
        <UnstyledCurrencyInput
          autoFocus={autoFocus}
          selectionColor={selectionStyles}
          editable={autoFocus}
          onChange={value => field.onChange(value)}
          maxLength={maxLength}
          style={[
            textStyles,
            fontSize === "s" ? styles.smallText : fontSize === "m" ? styles.mediumText : styles.largeText,
          ]}
          testID={testID !== undefined ? `${testID}-CurrencyInput` : undefined}
          value={field.value}
        />
        <Typography.Text
          color={isError ? "errorBase" : inputColor}
          size="title1"
          weight="medium"
          style={[
            currencyStyle,
            fontSize === "s"
              ? styles.smallCurrencyStyle
              : fontSize === "m"
              ? styles.mediumCurrencyStyle
              : styles.largeCurrencyStyle,
          ]}>
          {AmountType ?? t("InternalTransfers.TransferAmountInput.currency")}
        </Typography.Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  largeCurrencyStyle: {
    marginTop: 10,
  },
  largeText: {
    fontSize: 64,
    lineHeight: 76,
  },
  mediumCurrencyStyle: {
    marginTop: 20,
  },
  mediumText: {
    fontSize: 38,
    lineHeight: 48,
  },
  smallCurrencyStyle: {
    marginTop: 16,
  },
  smallText: {
    fontSize: 30,
    lineHeight: 34,
  },
});
