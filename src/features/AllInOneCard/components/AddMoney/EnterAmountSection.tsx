import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { AmountInput } from "@/components/Input/AmountInput";
import { useThemeStyles } from "@/theme";

import SwapIcon from "../../assets/icons/SwapIcon";
import { CurrencyConversion } from "../../mocks";
import { convertCurrency } from "../../utils/convertCurrency";
interface EnterAmountSectionProps {
  totalBalance: number;
  setAmount: (amount: number) => void;
  sourceCurrency: string;
  destinationCurrency: string;
}
export default function EnterAmountSection({
  totalBalance,
  setAmount,
  sourceCurrency: initialSourceCurrency,
  destinationCurrency: initialDestinationCurrency,
}: EnterAmountSectionProps) {
  const { t } = useTranslation();
  const [sourceCurrency, setSourceCurrency] = useState<string>(initialSourceCurrency);
  const [destinationCurrency, setDestinationCurrency] = useState<string>(initialDestinationCurrency);

  const handleSwapCurrency = () => {
    const temp = sourceCurrency;
    setSourceCurrency(destinationCurrency);
    setDestinationCurrency(temp);
  };

  const { control, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      enteredValue: 0,
    },
  });
  const enteredValue = watch("enteredValue");

  useEffect(() => {
    setDestinationCurrency(initialDestinationCurrency);
  }, [initialDestinationCurrency]);

  useEffect(() => {
    setAmount(enteredValue);
  }, [enteredValue, setAmount]);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const errorMessageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["errorBase-30"],
  }));

  const errorMessageStyle = useThemeStyles<TextStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));

  const swapSectionStyle = useThemeStyles<TextStyle>(theme => ({
    padding: theme.spacing["20p"],
    borderWidth: 1,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 8,
  }));

  return (
    <Stack direction="vertical" align="stretch" justify="space-between" gap="16p">
      <View style={containerStyle}>
        <Typography.Text color="neutralBase+30" size="title1" weight="medium">
          {t("AllInOneCard.AddMoneyScreen.enterAmount")}
        </Typography.Text>
        <AmountInput
          testID="AllInOneCard.AddMoneyScreen:AmountInput"
          autoFocus
          control={control}
          currentBalance={totalBalance}
          name="enteredValue"
          showConvertedBalance={false}
          AmountType={".00 " + destinationCurrency}
          inputColor="neutralBase+30"
          hideBalanceError={true}
        />
      </View>
      {enteredValue > totalBalance ? (
        <View style={errorMessageContainerStyle}>
          <Typography.Text color="errorBase" size="footnote" align="center" style={errorMessageStyle}>
            {t("AllInOneCard.AddMoneyScreen.amountExceedsBalance")}
          </Typography.Text>
        </View>
      ) : (
        <></>
      )}
      {initialDestinationCurrency !== "SAR" ? (
        <>
          <Stack direction="horizontal" justify="space-between" style={containerStyle}>
            <View>
              <Typography.Text color="neutralBase+30" size="footnote">
                {t("AllInOneCard.AddMoneyScreen.convertedAmount")}
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {convertCurrency(enteredValue, sourceCurrency, destinationCurrency).toFixed(2)} {sourceCurrency}
              </Typography.Text>
            </View>
            <Pressable testID="AllInOneCard.AddMoneyScreen:SwapCurrencyPressable" onPress={handleSwapCurrency}>
              <Stack direction="horizontal" gap="8p" style={swapSectionStyle}>
                <SwapIcon />
                <Typography.Text color="neutralBase+30" size="footnote" weight="medium">
                  {sourceCurrency}
                </Typography.Text>
              </Stack>
            </Pressable>
          </Stack>

          <Typography.Text color="neutralBase" size="caption1" style={containerStyle}>
            {t("AllInOneCard.AddMoneyScreen.exchangeRate") + " " + CurrencyConversion[initialDestinationCurrency]}
          </Typography.Text>
        </>
      ) : (
        <></>
      )}
    </Stack>
  );
}
