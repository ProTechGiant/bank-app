import { useEffect, useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";

import { ArrowForwardIcon } from "@/assets/icons";
import CurrencyInput from "@/components/CurrencyInput";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TransferAmountInput<T extends FieldValues> {
  autoFocus?: boolean;
  control: Control<T>;
  helperText?: string | ((value: number) => string | undefined);
  maxLength?: number;
  name: Path<T>;
  balance: number;
  onAddFund: () => void;
}

export default function TransferAmountInput<T extends FieldValues>({
  autoFocus,
  control,
  helperText,
  maxLength,
  name,
  balance,
  onAddFund,
}: TransferAmountInput<T>) {
  const { t } = useTranslation();
  const { field, fieldState } = useController({ control, name });
  const textInputRef = useRef<TextInput>(null);
  const [fontSize, setFontSize] = useState<"s" | "m" | "l">("l");

  const isError = undefined !== fieldState.error;
  const errorText = isError ? fieldState.error?.message : undefined;

  const resolvedHelperText = isError
    ? errorText
    : typeof helperText === "function"
    ? helperText(field.value)
    : helperText;

  useEffect(() => {
    field.value !== undefined && String(field.value)?.length > 10
      ? setFontSize("s")
      : field.value !== undefined && String(field.value)?.length > 7
      ? setFontSize("m")
      : setFontSize("l");
  }, [field.value]);

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  const textStyles = useThemeStyles<ViewStyle & TextStyle>(
    theme => ({
      color: isError && field.value > 0 ? theme.palette.errorBase : theme.palette.primaryBase,
      fontWeight: theme.typography.text.weights.medium,
      padding: 0,
      margin: 0,
      alignSelf: "center",
    }),
    [isError]
  );

  const helperTextStyles = useThemeStyles<TextStyle>(theme => ({
    marginRight: theme.spacing["8p"],
  }));

  const selectionStyles = useThemeStyles<string>(theme => theme.palette.complimentBase, []);

  const currencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginLeft: theme.spacing["4p"],
    marginVertical: theme.spacing["12p"],
  }));

  const largeCurrencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["10p"],
  }));

  const mediumCurrencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));
  const smallCurrencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const container = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "flex-start",
    flexDirection: "row",
    marginLeft: theme.spacing["20p"],
    marginBottom: theme.spacing["8p"],
    height: 70,
  }));

  const errorMessageStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["errorBase-40"],
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing["20p"],
    paddingLeft: theme.spacing["20p"],
  }));

  const addFundStyle = useThemeStyles<ViewStyle>(theme => ({
    marginRight: theme.spacing["4p"],
  }));

  const balanceContainer = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing["20p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.errorBase);

  return (
    <View>
      <View style={balanceContainer}>
        <Typography.Text color={isError && field.value > 0 ? "errorBase" : "neutralBase-10"} size="callout">
          {t("InternalTransfers.InternalTransferScreen.balance") +
            balance?.toLocaleString("en-US") +
            t("InternalTransfers.InternalTransferScreen.currency")}
        </Typography.Text>
      </View>
      <View style={containerStyles}>
        <View style={container}>
          <CurrencyInput
            ref={textInputRef}
            autoFocus={autoFocus}
            selectionColor={selectionStyles}
            editable={autoFocus}
            onChange={field.onChange}
            maxLength={maxLength}
            style={[
              textStyles,
              fontSize === "s" ? styles.smallText : fontSize === "m" ? styles.mediumText : styles.largeText,
            ]}
            value={field.value}
          />
          <View style={styles.buttonContainer}>
            <Typography.Text
              color={isError && field.value > 0 ? "errorBase" : "primaryBase"}
              size="body"
              weight="medium"
              style={[
                currencyStyle,
                fontSize === "s" ? smallCurrencyStyle : fontSize === "m" ? mediumCurrencyStyle : largeCurrencyStyle,
              ]}>
              {t("InternalTransfers.InternalTransferScreen.currency")}
            </Typography.Text>
          </View>
        </View>
        {undefined !== resolvedHelperText && field.value > 0 && (
          <View style={errorMessageStyle}>
            <Typography.Text color="errorBase" size="footnote" weight="regular" style={helperTextStyles}>
              {resolvedHelperText}
            </Typography.Text>
            <Pressable style={styles.fundButtonContainer} onPress={onAddFund}>
              <Typography.Text color="errorBase" size="footnote" weight="medium" style={addFundStyle}>
                {t("InternalTransfers.InternalTransferScreen.addFunds")}
              </Typography.Text>
              <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                <ArrowForwardIcon color={iconColor} />
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: "auto",
  },
  fundButtonContainer: {
    flexDirection: "row",
  },
  largeText: {
    fontSize: 56, // not in core theme
    lineHeight: 67,
  },
  mediumText: {
    fontSize: 38, // not in core theme
    lineHeight: 48,
  },
  smallText: {
    fontSize: 30, // not in core theme
    lineHeight: 34,
  },
});
