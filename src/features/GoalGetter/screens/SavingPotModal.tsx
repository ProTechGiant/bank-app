import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { GoldFinalDealResponseType, MeasureUnitEnum } from "@/features/GoldWallet/types";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { MarketStatusEnum } from "@/types/timer";

import { GoalManagementSuccessfulIcon } from "../assets/icons";
import { SavingPotsType } from "../utils";

interface TransactionSummaryModalProps {
  isVisible: boolean;
  changeVisibility: (status: boolean) => void;
  walletId: string;
  weight: number;
  type: SavingPotsType;
  measureUnit: MeasureUnitEnum;
  marketStatus: MarketStatusEnum;
  onAcceptDeal: (finalDealData: GoldFinalDealResponseType) => void;
  isAcceptingTheDeal: boolean;
}

export default function SavingPotModal({ isVisible, changeVisibility, type }: TransactionSummaryModalProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onConfirm = () => {
    changeVisibility(false);

    if (type === SavingPotsType.ADDMONEY) {
      navigation.navigate("GoalGetter.GoalManagementSuccessfulScreen", {
        title: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.label"),
        subtitle: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.addMoneySubLabel"),
        viewTransactions: false,
        icon: <GoalManagementSuccessfulIcon />,
      });
    } else {
      navigation.navigate("GoalGetter.GoalManagementSuccessfulScreen", {
        title: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.label"),
        subtitle: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.withDrawMoneySubLabel"),

        viewTransactions: false,
        icon: <GoalManagementSuccessfulIcon />,
      });
    }
  };

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

  return (
    <Modal
      visible={isVisible}
      onBack={() => changeVisibility(false)}
      onClose={() => changeVisibility(false)}
      style={styles.modalStyle}>
      <ScrollView showsVerticalScrollIndicator={false} style={scrollViewStyle}>
        <Typography.Text color="neutralBase+30" size="title1" weight="bold">
          {type === SavingPotsType.ADDMONEY
            ? t("Home.DashboardScreen.GoalGetter.actionsSummary.addMoneySummary")
            : t("Home.DashboardScreen.GoalGetter.actionsSummary.withDrawSummary")}
        </Typography.Text>
        <Stack direction="vertical" style={summaryDateStyle}>
          <Stack direction="vertical" style={summaryTableStyle}>
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.from")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {type === SavingPotsType.ADDMONEY
                ? t("Home.DashboardScreen.GoalGetter.actionsSummary.currentAccount")
                : t("Home.DashboardScreen.GoalGetter.actionsSummary.savingPot")}
            </Typography.Text>
          </Stack>
          <Stack direction="vertical" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.to")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {type === SavingPotsType.ADDMONEY
                ? t("Home.DashboardScreen.GoalGetter.actionsSummary.savingPot")
                : t("Home.DashboardScreen.GoalGetter.actionsSummary.currentAccount")}
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.originalBalance")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="bold">
              210.00
              <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                {" SAR"}
              </Typography.Text>
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.withdrawalAmount")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="bold">
              210.00
              <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                {" SAR"}
              </Typography.Text>
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.remainingBalance")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="bold">
              210.00
              <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                {" SAR"}
              </Typography.Text>
            </Typography.Text>
          </Stack>
        </Stack>

        <View style={confirmButtonStyle}>
          <Button
            onPress={() => {
              onConfirm();
            }}>
            {" "}
            {t("Home.DashboardScreen.GoalGetter.actionsSummary.confirm")}
          </Button>
        </View>
      </ScrollView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalStyle: {
    height: "95%",
    width: "100%",
  },
});
