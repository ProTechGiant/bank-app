import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { GoldFinalDealResponseType, MeasureUnitEnum, TransactionTypeEnum } from "@/features/GoldWallet/types";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { MarketStatusEnum } from "@/types/timer";

import { MutualFundsSuccessfulIcon } from "../assets/icons";
import { TermsAndConditions } from "../components";
import TermsAndConditionsModal from "./TermsAndConditionsModal";

interface TransactionSummaryModalProps {
  isVisible: boolean;
  changeVisibility: (status: boolean) => void;
  walletId: string;
  weight: number;
  type: TransactionTypeEnum;
  measureUnit: MeasureUnitEnum;
  marketStatus: MarketStatusEnum;
  onAcceptDeal: (finalDealData: GoldFinalDealResponseType) => void;
  isAcceptingTheDeal: boolean;
}
export default function MutualFundModal({ isVisible, changeVisibility, type, weight }: TransactionSummaryModalProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isActive, setIsActive] = useState<boolean>(false);

  const summaryDateStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.palette["neutralBase-30"],
    marginTop: theme.spacing["24p"],
  }));
  const summaryTableStyle = useThemeStyles<ViewStyle>(theme => ({
    borderBottomWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    padding: theme.spacing["16p"],
    width: "100%",
  }));

  const confirmButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
    marginBottom: theme.spacing["32p"],
  }));

  const scrollViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
    paddingBottom: theme.spacing["32p"],
  }));
  const handleOnCheckboxPress = () => {
    setIsDisabled(value => !value);
  };

  const handleOnPressTermsAndConditions = () => {
    setIsActive(true);
  };
  const onConfirm = () => {
    changeVisibility(false);
    navigation.navigate("GoalGetter.GoalManagementSuccessfulScreen", {
      title: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.label"),
      subtitle: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.buyMutualFundSubLabel"),
      viewTransactions: true,
      icon: <MutualFundsSuccessfulIcon />,
    });
  };

  return (
    <>
      <Modal
        visible={isVisible}
        onBack={() => changeVisibility(false)}
        onClose={() => changeVisibility(false)}
        style={styles.modalStyle}>
        <ScrollView showsVerticalScrollIndicator={false} style={scrollViewStyle}>
          <Typography.Text color="neutralBase+30" size="title1" weight="bold">
            {type === TransactionTypeEnum.BUY
              ? t("Home.DashboardScreen.GoalGetter.actionsSummary.buySummary")
              : t("Home.DashboardScreen.GoalGetter.actionsSummary.sellSummary")}
          </Typography.Text>
          <Stack direction="vertical" style={summaryDateStyle}>
            <Stack direction="vertical" style={summaryTableStyle}>
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {t("Home.DashboardScreen.GoalGetter.actionsSummary.from")}
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {type === TransactionTypeEnum.BUY
                  ? t("Home.DashboardScreen.GoalGetter.actionsSummary.currentAccount")
                  : t("Home.DashboardScreen.GoalGetter.actionsSummary.alRajhiGrowthFund")}
              </Typography.Text>
            </Stack>
            <Stack direction="vertical" style={summaryTableStyle} justify="space-between">
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {t("Home.DashboardScreen.GoalGetter.actionsSummary.to")}
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {type === TransactionTypeEnum.BUY
                  ? t("Home.DashboardScreen.GoalGetter.actionsSummary.alRajhiGrowthFund")
                  : t("Home.DashboardScreen.GoalGetter.actionsSummary.currentAccount")}
              </Typography.Text>
            </Stack>
            <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {t("Home.DashboardScreen.GoalGetter.actionsSummary.originalAmount")}
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="callout" weight="bold">
                210
                <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                  .00 SAR
                </Typography.Text>
              </Typography.Text>
            </Stack>
            <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {t("Home.DashboardScreen.GoalGetter.actionsSummary.withdrawalAmount")}
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="callout" weight="bold">
                {weight}
                <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                  .00 SAR
                </Typography.Text>
              </Typography.Text>
            </Stack>
            <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {t("Home.DashboardScreen.GoalGetter.actionsSummary.remainingAmount")}
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="callout" weight="bold">
                210
                <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                  .00 SAR
                </Typography.Text>
              </Typography.Text>
            </Stack>
            <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {t("Home.DashboardScreen.GoalGetter.actionsSummary.total")}
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="callout" weight="bold">
                {1 + " "}
                <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                  Unit
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="callout" weight="bold">
                  = 10
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                  .25 SAR
                </Typography.Text>
              </Typography.Text>
            </Stack>
            <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {t("Home.DashboardScreen.GoalGetter.actionsSummary.total")}
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                8,120 ÷ 10.25 =
                <Typography.Text color="neutralBase+30" size="callout" weight="bold">
                  792
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                  .19 Units
                </Typography.Text>
              </Typography.Text>
            </Stack>
          </Stack>
          <View style={confirmButtonStyle}>
            <TermsAndConditions
              conditionsCaption={t("GoalGetter.GoalReviewScreen.termsAndConditionsText")}
              conditionsLink={t("GoalGetter.GoalReviewScreen.termsAndConditionsLink")}
              onCheckBoxPress={handleOnCheckboxPress}
              isChecked={!isDisabled}
              onPress={handleOnPressTermsAndConditions}
            />
          </View>
          <View style={confirmButtonStyle}>
            <Button disabled={isDisabled} onPress={() => onConfirm()}>
              {" "}
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.confirm")}{" "}
            </Button>
          </View>
        </ScrollView>
      </Modal>
      <TermsAndConditionsModal productId="1" isVisible={isActive} changeVisibility={setIsActive} />
    </>
  );
}
const styles = StyleSheet.create({
  modalStyle: {
    height: "95%",
    width: "100%",
  },
});
