import { t } from "i18next";
import React from "react";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Radio from "@/components/Radio";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { CalendarIcon, MonthlyCalendarIcon } from "../assets/icons";
import { PAYMENT_METHOD_ANNUAL } from "../constants";
import { PricePlan } from "../types";
import { extractNumber } from "../utils/ExtractCurrencyInfo";

interface OptionsListProps {
  optionsList: PricePlan[];
  onSelectOptions: (value: string) => void;
  predefinedValue?: string;
}

export default function PaymentOptionsList({ optionsList, onSelectOptions, predefinedValue }: OptionsListProps) {
  const yearlyFees = optionsList.filter(item => item.Code === PAYMENT_METHOD_ANNUAL)[0].Fees;
  const monthlyFees = optionsList.filter(item => item.Code !== PAYMENT_METHOD_ANNUAL)[0].Fees;
  const discount = (((monthlyFees * 12 - yearlyFees) / (monthlyFees * 12)) * 100).toFixed(0);

  const selectionCardStackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["16p"],
    borderRadius: theme.spacing["8p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["8p"],
    borderRadius: theme.spacing["8p"],
    backgroundColor: theme.palette["secondary_yellowBase-10"],
  }));

  const rowContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <>
      {optionsList.map((paymentOption: PricePlan) => {
        const backgroundColor = paymentOption.Code === predefinedValue ? "#F2F2F2" : "transparent";
        const containerBackground = paymentOption.Code === predefinedValue ? "#D9D9D9" : "#F2F2F2";
        const rowMargin = paymentOption.Code === PAYMENT_METHOD_ANNUAL ? rowContainerStyle : null;
        return (
          <Pressable onPress={() => onSelectOptions(paymentOption.Code)} key={paymentOption.Id}>
            <Stack
              direction="horizontal"
              justify="space-between"
              align="center"
              style={[selectionCardStackStyle, { backgroundColor: backgroundColor }]}>
              <Stack direction="horizontal" gap="16p" style={style.nameAndDescriptionStack}>
                {paymentOption.Id === 1 ? <CalendarIcon /> : <MonthlyCalendarIcon />}
                <Stack direction="vertical">
                  <Stack direction="horizontal" gap="8p" style={rowMargin}>
                    {paymentOption.Code === PAYMENT_METHOD_ANNUAL ? (
                      <View style={containerStyle}>
                        <Typography.Text size="caption1" weight="regular" color="neutralBase+30">
                          {t("AllInOneCard.SelectPaymentOptionScreen.Recommended")}
                        </Typography.Text>
                      </View>
                    ) : (
                      <></>
                    )}
                    {paymentOption.Code === PAYMENT_METHOD_ANNUAL ? (
                      <View style={[containerStyle, { backgroundColor: containerBackground }]}>
                        <Typography.Text size="caption1" weight="regular" color="neutralBase+30">
                          {discount}
                          {t("AllInOneCard.SelectPaymentOptionScreen.off")}
                        </Typography.Text>
                      </View>
                    ) : (
                      <></>
                    )}
                  </Stack>
                  <Stack direction="vertical" gap="4p" justify="space-between">
                    <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                      {I18nManager.isRTL ? paymentOption.ArabicName : paymentOption.englishName}
                    </Typography.Text>
                    <Typography.Text>
                      <Typography.Text size="footnote" weight="bold" color="neutralBase-10">
                        {extractNumber(`${paymentOption.Fees}`)}
                        <Typography.Text size="footnote" weight="regular" color="neutralBase-10">
                          {paymentOption.Code === PAYMENT_METHOD_ANNUAL
                            ? ` ${t("AllInOneCard.SelectedCardScreen.SARYearly")}`
                            : ` ${t("AllInOneCard.SelectedCardScreen.SARMonthly")}`}
                        </Typography.Text>
                      </Typography.Text>
                    </Typography.Text>
                  </Stack>
                </Stack>
              </Stack>
              <Radio
                isSelected={paymentOption.Code === predefinedValue}
                onPress={() => onSelectOptions(paymentOption.Code)}
              />
            </Stack>
          </Pressable>
        );
      })}
    </>
  );
}

const style = StyleSheet.create({
  nameAndDescriptionStack: {
    width: "70%",
  },
});
