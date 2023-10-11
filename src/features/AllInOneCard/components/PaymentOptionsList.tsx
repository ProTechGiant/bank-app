import { t } from "i18next";
import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Radio from "@/components/Radio";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { CalendarIcon, MonthlyCalendarIcon } from "../assets/icons";
import { PaymentOption } from "../types";
import { extractNumber, extractText } from "../utils/ExtractCurrencyInfo";

interface OptionsListProps {
  optionsList: PaymentOption[];
  onSelectOptions: (value: number) => void;
  predefinedValue: number;
}

export default function PaymentOptionsList({ optionsList, onSelectOptions, predefinedValue }: OptionsListProps) {
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
      {optionsList.map((paymentOption: PaymentOption) => {
        const backgroundColor = paymentOption.Id === predefinedValue ? "#F2F2F2" : "transparent";
        const containerBackground = paymentOption.Id === predefinedValue ? "#D9D9D9" : "#F2F2F2";
        const rowMargin = paymentOption.isRecommended || paymentOption.discount ? rowContainerStyle : null;
        return (
          <Pressable onPress={() => onSelectOptions(paymentOption.Id)}>
            <Stack
              direction="horizontal"
              justify="space-between"
              align="center"
              style={[selectionCardStackStyle, { backgroundColor: backgroundColor }]}>
              <Stack direction="horizontal" gap="16p" style={style.nameAndDescriptionStack}>
                {paymentOption.Id === 1 ? <CalendarIcon /> : <MonthlyCalendarIcon />}
                <Stack direction="vertical">
                  <Stack direction="horizontal" gap="8p" style={rowMargin}>
                    {paymentOption.isRecommended ? (
                      <View style={containerStyle}>
                        <Typography.Text size="caption1" weight="regular" color="neutralBase+30">
                          {t("AllInOneCard.SelectPaymentOptionScreen.Recommended")}
                        </Typography.Text>
                      </View>
                    ) : (
                      <></>
                    )}
                    {paymentOption.discount ? (
                      <View style={[containerStyle, { backgroundColor: containerBackground }]}>
                        <Typography.Text size="caption1" weight="regular" color="neutralBase+30">
                          {paymentOption.discount}
                          {t("AllInOneCard.SelectPaymentOptionScreen.off")}
                        </Typography.Text>
                      </View>
                    ) : (
                      <></>
                    )}
                  </Stack>
                  <Stack direction="vertical" gap="4p" justify="space-between">
                    <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                      {paymentOption.Name}
                    </Typography.Text>
                    <Typography.Text>
                      <Typography.Text size="footnote" weight="bold" color="neutralBase-10">
                        {extractNumber(paymentOption.Description)}
                        <Typography.Text size="footnote" weight="regular" color="neutralBase-10">
                          {" " + extractText(paymentOption.Description)}
                        </Typography.Text>
                      </Typography.Text>
                    </Typography.Text>
                  </Stack>
                </Stack>
              </Stack>
              <Radio
                isSelected={paymentOption.Id === predefinedValue}
                onPress={() => onSelectOptions(paymentOption.Id)}
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
