import Slider from "@react-native-community/slider";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Pill from "@/components/Pill";
import { useThemeStyles } from "@/theme";

import { MonthCalenderIcon } from "../assets/icons";
import { CheckProductRiskResponse, PaymentEnum, PaymentType } from "../types";
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

  const handleOnPaymentPress = (selectedValue: PaymentType) => {
    if (PaymentEnum.OneTime === selectedValue) {
      onMonthlyAmountChange(`0.00`);
      onSelectPayment(selectedValue);
    } else {
      onSelectPayment(selectedValue);
    }
  };

  const handleOnSliderChange = (value: number) => {
    if (PaymentEnum.OneTime === selectedPayment) {
      onMonthlyAmountChange(`0.00`);
    } else {
      onMonthlyAmountChange(
        value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["20p"],
    backgroundColor: theme.palette.primaryBase,
  }));

  return (
    <Stack direction="vertical" align="stretch">
      <Stack direction="vertical" gap="16p" align="stretch" style={contentContainerStyle}>
        <Stack direction="horizontal" gap="8p" align="center">
          <Typography.Text color="supportBase-30" size="callout" weight="medium">
            {t("MutualFund.MutualFundDetailsScreen.payment")}
          </Typography.Text>
          <Pill
            isActive={PaymentEnum.OneTime === selectedPayment}
            onPress={() => handleOnPaymentPress(PaymentEnum.OneTime)}>
            {t("MutualFund.MutualFundDetailsScreen.oneTime")}
          </Pill>
          <Pill
            isActive={PaymentEnum.Monthly === selectedPayment}
            onPress={() => handleOnPaymentPress(PaymentEnum.Monthly)}>
            {t("MutualFund.MutualFundDetailsScreen.monthly")}
          </Pill>
          {/* TODO: handle date selection in next BC */}
          {PaymentEnum.Monthly === selectedPayment ? (
            <Pill
              isActive={false}
              onPress={() => {
                return;
              }}>
              <MonthCalenderIcon />
            </Pill>
          ) : null}
        </Stack>
        <MutualFundDetailsInput
          title={t("MutualFund.MutualFundDetailsScreen.startingAmount")}
          inputValue={startingAmountValue}
          handleOnChange={onStartingAmountChange}
        />
        <MutualFundDetailsInput
          title={t("MutualFund.MutualFundDetailsScreen.investMonthly")}
          inputValue={monthlyAmountValue}
          handleOnChange={onMonthlyAmountChange}
          editable={PaymentEnum.OneTime !== selectedPayment}
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
            disabled={PaymentEnum.OneTime === selectedPayment}
          />
        </Stack>

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
