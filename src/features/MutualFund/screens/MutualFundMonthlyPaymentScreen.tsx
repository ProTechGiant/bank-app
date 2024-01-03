import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DayPicker from "@/components/DayPicker";
import { CheckboxInput, CurrencyInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Toggle from "@/components/Toggle";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import CalendarButton from "../components/CalendarButton";
import { useGetFundRecurring, usePostFundRecurring } from "../hooks/query-hooks";

export default function MutualFundMonthlyPaymentScreen() {
  const { t } = useTranslation();

  const { data: getFundRecurring, isLoading } = useGetFundRecurring(123, 55); // TODO: add productId: number, portfolioId: number from navigation
  const { mutateAsync: postFundRecurring } = usePostFundRecurring();

  const [selectedDay, setSelectedDay] = useState<number | undefined>(undefined);
  const [changedDay, setChangedDay] = useState<number | undefined>(undefined);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [active, setActiveFlag] = useState<number | undefined>(undefined);
  const [checked, setChecked] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (getFundRecurring) {
      setSelectedDay(getFundRecurring.RecurringDay);
      setChangedDay(getFundRecurring.RecurringDay);
      setAmount(getFundRecurring.Amount);
      setActiveFlag(getFundRecurring.ActiveFlag);
    }
  }, [getFundRecurring]);

  const handleOnConfrimPress = async () => {
    if (getFundRecurring) {
      try {
        await postFundRecurring({
          ...getFundRecurring,
          Amount: amount,
          ActiveFlag: active,
          RecurringDay: selectedDay,
        });
        // TODO: check if navigation back is needed here after post success
      } catch (error) {
        warn("post Recurring error", "error", JSON.stringify(error));
      }
    }
  };

  const handleOnDayPickerClose = () => {
    setShowDatePicker(false);
  };

  const handleOnDayPickerConfirm = () => {
    setSelectedDay(changedDay);
    setShowDatePicker(false);
  };

  const orderSummaryButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    gap: theme.spacing["32p"],
    paddingBottom: theme.spacing["32p"],
  }));

  const orderContentBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader />
      {!isLoading ? (
        <>
          <ScrollView style={{ flex: 1 }}>
            <ContentContainer style={orderContentBoxStyle}>
              <Typography.Text size="title1" weight="bold">
                {t("MutualFund.MutualFundMonthlyPaymentScreen.monthlyPayment")}
              </Typography.Text>
              <Stack direction="vertical" align="stretch" gap="8p">
                <Typography.Text size="callout">
                  {t("MutualFund.MutualFundMonthlyPaymentScreen.amount")}
                </Typography.Text>
                <CurrencyInput
                  label=""
                  value={amount}
                  currency={t("MutualFund.MutualFundMonthlyPaymentScreen.currency")}
                  onChange={value => {
                    setAmount(value);
                  }}
                  maxLength={8}
                />
              </Stack>
              <Stack direction="vertical" align="stretch" gap="8p">
                <Typography.Text size="callout">
                  {t("MutualFund.MutualFundMonthlyPaymentScreen.dayOfMonth")}
                </Typography.Text>
                <CalendarButton
                  selectedDate={selectedDay}
                  onClick={() => {
                    setShowDatePicker(true);
                  }}
                />
              </Stack>
              <Stack direction="horizontal" gap="16p" align="center">
                <Stack direction="vertical" gap="4p" flex={1}>
                  <Typography.Text size="callout">
                    {t("MutualFund.MutualFundMonthlyPaymentScreen.activateMonthlyPayment")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase" size="footnote" weight="regular">
                    {t("MutualFund.MutualFundMonthlyPaymentScreen.deductionDetails", { amount, selectedDay })}
                  </Typography.Text>
                </Stack>
                <Stack direction="vertical">
                  <Toggle
                    onPress={() => {
                      setActiveFlag(Number(!active));
                    }}
                    value={Boolean(active)}
                  />
                </Stack>
              </Stack>
            </ContentContainer>
          </ScrollView>
          <View style={orderSummaryButtonStyle}>
            <Pressable
              onPress={() => {
                setChecked(!checked);
              }}>
              <Stack direction="horizontal" gap="8p">
                <CheckboxInput
                  value={checked}
                  onChange={() => {
                    setChecked(!checked);
                  }}
                />
                <Typography.Text color="neutralBase" size="footnote" weight="regular" style={{ flex: 1 }}>
                  {t("MutualFund.MutualFundMonthlyPaymentScreen.agreementText")}
                </Typography.Text>
              </Stack>
            </Pressable>
            <Button onPress={handleOnConfrimPress} disabled={!checked}>
              {t("MutualFund.MutualFundMonthlyPaymentScreen.confirmButton")}
            </Button>
          </View>
          <DayPicker
            buttonText={t("MutualFund.MutualFundDetailsScreen.modalConfirm")}
            headerText={t("MutualFund.MutualFundDetailsScreen.selectRecurringDay")}
            onChange={value => {
              setChangedDay(value);
            }}
            isVisible={showDatePicker}
            onClose={handleOnDayPickerClose}
            onConfirm={handleOnDayPickerConfirm}
            value={changedDay}
          />
        </>
      ) : null}
    </Page>
  );
}
