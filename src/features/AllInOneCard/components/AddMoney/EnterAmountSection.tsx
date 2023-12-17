import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { AmountInput } from "@/components/Input/AmountInput";
import { useThemeStyles } from "@/theme";

interface EnterAmountSectionProps {
  totalBalance: number;
  setAmount: (amount: number) => void;
}
export default function EnterAmountSection({ totalBalance, setAmount }: EnterAmountSectionProps) {
  const { t } = useTranslation();
  const { control, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      SARValue: 0,
    },
  });
  const SARValue = watch("SARValue");

  useEffect(() => {
    setAmount(SARValue);
  }, [SARValue, setAmount]);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["16p"],
  }));

  const textStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const errorMessageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["errorBase-30"],
  }));

  const errorMessageStyle = useThemeStyles<TextStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));

  return (
    <Stack direction="vertical" align="stretch" justify="space-between">
      <View style={containerStyle}>
        <Typography.Text color="neutralBase+30" size="title1" weight="medium" style={textStyle}>
          {t("AllInOneCard.AddMoneyScreen.enterAmount")}
        </Typography.Text>
        <AmountInput
          testID="AllInOneCard.AddMoneyScreen:AmountInput"
          autoFocus
          control={control}
          currentBalance={100}
          maxLength={8}
          name="SARValue"
          showConvertedBalance={false}
          AmountType={".00 " + t("AllInOneCard.AddMoneyScreen.sar")}
          inputColor="neutralBase+30"
          hideBalanceError={true}
        />
      </View>
      {SARValue > totalBalance ? (
        <View style={errorMessageContainerStyle}>
          <Typography.Text color="errorBase" size="footnote" align="center" style={errorMessageStyle}>
            {t("AllInOneCard.AddMoneyScreen.amountExceedsBalance")}
          </Typography.Text>
        </View>
      ) : (
        <></>
      )}
    </Stack>
  );
}
