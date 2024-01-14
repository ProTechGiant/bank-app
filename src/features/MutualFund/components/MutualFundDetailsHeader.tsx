import Slider from "@react-native-community/slider";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import DayPicker from "@/components/DayPicker";
import { useThemeStyles } from "@/theme";

import { MonthCalenderIcon } from "../assets/icons";
import { useMutualFundContext } from "../contexts/MutualFundContext";
import { CheckProductRiskResponse, PaymentEnum, PaymentType } from "../types";
import CustomPill from "./CustomPill";
import MutualFundBrandDivider from "./MutualFundBrandDivider";
import MutualFundDetailsInput from "./MutualFundDetailsInput";

interface MutualFundDetailsHeaderProps {
  selectedPayment: PaymentType;
  startingAmountValue: string;
  monthlyAmountValue: string;
  onSelectPayment: Dispatch<SetStateAction<PaymentType>>;
  onStartingAmountChange: Dispatch<SetStateAction<string>>;
  onMonthlyAmountChange: Dispatch<SetStateAction<string>>;
  checkProductRiskData: CheckProductRiskResponse | undefined;
}

export default function MutualFundDetailsHeader({
  selectedPayment,
  startingAmountValue,
  monthlyAmountValue,
  onSelectPayment,
  onStartingAmountChange,
  onMonthlyAmountChange,
  checkProductRiskData,
}: MutualFundDetailsHeaderProps) {
  const { t } = useTranslation();
  const { setMutualFundContextState } = useMutualFundContext();

  const [selectedDay, setSelectedDay] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleOnPaymentPress = (selectedValue: PaymentType) => {
    onSelectPayment(selectedValue);
  };

  const handleOnSliderChange = (value: number) => {
    onMonthlyAmountChange(
      value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const handleOnMonthlyPress = () => {
    handleOnPaymentPress(PaymentEnum.Monthly);
    setShowDatePicker(true);
  };

  const handleOnDayPickerClose = () => {
    setSelectedDay(null);
    setShowDatePicker(false);
  };

  const handleOnDayPickerConfirm = () => {
    setMutualFundContextState({ selectedDay: selectedDay });
    setShowDatePicker(false);
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["20p"],
    backgroundColor: theme.palette.primaryBase,
  }));

  return (
    <Stack direction="vertical" align="stretch">
      <Stack direction="vertical" gap="32p" align="stretch" style={contentContainerStyle}>
        <Stack direction="horizontal" gap="8p" align="center">
          <Typography.Text color="supportBase-30" size="callout" weight="medium">
            {t("MutualFund.MutualFundDetailsScreen.payment")}
          </Typography.Text>
          <CustomPill
            title={t("MutualFund.MutualFundDetailsScreen.oneTime")}
            isActive={PaymentEnum.OneTime === selectedPayment}
            onPress={() => handleOnPaymentPress(PaymentEnum.OneTime)}
          />
          <CustomPill
            title={t("MutualFund.MutualFundDetailsScreen.monthly")}
            isActive={PaymentEnum.Monthly === selectedPayment}
            onPress={handleOnMonthlyPress}>
            <MonthCalenderIcon />
            <Typography.Text color="complimentBase" size="footnote" weight="medium">
              {selectedDay}
            </Typography.Text>
          </CustomPill>
        </Stack>
        <MutualFundDetailsInput
          title={
            PaymentEnum.OneTime === selectedPayment
              ? t("MutualFund.MutualFundDetailsScreen.amount")
              : t("MutualFund.MutualFundDetailsScreen.startingAmount")
          }
          inputValue={startingAmountValue}
          handleOnChange={onStartingAmountChange}
          showInfoIcon
        />
        {PaymentEnum.Monthly === selectedPayment ? (
          <>
            <MutualFundDetailsInput
              title={t("MutualFund.MutualFundDetailsScreen.investMonthly")}
              inputValue={monthlyAmountValue}
              handleOnChange={onMonthlyAmountChange}
            />
            <Stack direction="vertical" align="stretch">
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10000}
                value={Number(monthlyAmountValue)}
                step={100}
                onValueChange={handleOnSliderChange}
                maximumTrackTintColor="#d3d3d3"
                minimumTrackTintColor="#FF4500"
                thumbTintColor="#FF4500"
              />
            </Stack>
          </>
        ) : null}

        {checkProductRiskData !== undefined ? (
          Number(startingAmountValue.replace(/,/g, "")) <= checkProductRiskData.MinimumSubscription ? (
            <Stack direction="vertical" style={styles.warningBox}>
              <Typography.Text size="caption1" color="complimentBase-10">
                {t("MutualFund.MutualFundDetailsScreen.subscriptionRequirement")}
              </Typography.Text>
            </Stack>
          ) : null
        ) : null}
      </Stack>
      <MutualFundBrandDivider />
      <DayPicker
        buttonText={t("MutualFund.MutualFundDetailsScreen.modalConfirm")}
        headerText={t("MutualFund.MutualFundDetailsScreen.selectRecurringDay")}
        onChange={value => {
          setSelectedDay(value);
        }}
        isVisible={showDatePicker}
        onClose={handleOnDayPickerClose}
        onConfirm={handleOnDayPickerConfirm}
        value={selectedDay || 28}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  slider: {
    flex: 1,
    height: 20,
    marginHorizontal: -10,
  },
  warningBox: {
    marginTop: 20,
  },
});
