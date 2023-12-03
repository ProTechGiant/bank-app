import { toInteger } from "lodash";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { IconProps, InfoCircleIcon } from "@/assets/icons";
import { Modal, Stack, Typography } from "@/components";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import { ClockIcon } from "@/features/GoldWallet/assets";
import { GoldFinalDealResponseType, MeasureUnitEnum, TransactionTypeEnum } from "@/features/GoldWallet/types";
import useTimer from "@/hooks/timer-hook";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { MarketStatusEnum, TimerStatusEnum } from "@/types/timer";

import { GoalManagementSuccessfulIcon } from "../assets/icons";

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
export default function GoldSummaryModal({ isVisible, changeVisibility, type }: TransactionSummaryModalProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const infoIconColor = useThemeStyles<IconProps>(theme => ({ color: theme.palette["complimentBase-20"] }));
  const { timer, resumeTimer, timerStatus } = useTimer();
  const handleOnRefreshTimerPress = () => {
    resumeTimer();
  };

  const onConfirm = () => {
    changeVisibility(false);
    if (type === TransactionTypeEnum.BUY) {
      navigation.navigate("GoalGetter.GoalManagementSuccessfulScreen", {
        title: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.buyGoldLabel"),
        subtitle: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.buyGoldSubLabel"),
        viewTransactions: true,
        icon: <GoalManagementSuccessfulIcon />,
      });
    } else {
      navigation.navigate("GoalGetter.GoalManagementSuccessfulScreen", {
        title: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.label"),
        subtitle: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.sellGoldSubLabel"),

        viewTransactions: true,
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

  const accordionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  const scrollViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
    paddingBottom: theme.spacing["32p"],
  }));

  const timerTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));
  const timerExpiredTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    marginTop: theme.spacing["8p"],
  }));

  const statusSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: theme.spacing["20p"],
  }));

  return (
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
              {type === TransactionTypeEnum.BUY ? "Current account" : "Gold Wallet"}
            </Typography.Text>
          </Stack>
          <Stack direction="vertical" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.to")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {type === TransactionTypeEnum.BUY ? "Gold Wallet" : "Current account"}
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.originalAmount")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="body" weight="bold">
              47 Grams (9,870
              <Typography.Text color="neutralBase+30" size="caption1" weight="medium">
                .00 SAR)
              </Typography.Text>
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.buyQty")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="regular">
              5g
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.gramValue")}
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
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.total")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="regular">
              5g x 210.00 =
              <Typography.Text color="neutralBase+30" size="footnote" weight="bold">
                1,050
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                .00 SAR
              </Typography.Text>
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.updatedAmount")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="body" weight="bold">
              52 Grams (12,870
              <Typography.Text color="neutralBase+30" size="caption1" weight="medium">
                .00 SAR)
              </Typography.Text>
            </Typography.Text>
          </Stack>
        </Stack>
        <Stack direction="vertical" style={statusSectionStyle}>
          <ClockIcon />

          <>
            {timerStatus === TimerStatusEnum.RUNNING ? (
              <Typography.Text style={timerTextStyle}>
                {t("GoldWallet.TransactionSummaryModal.priceWillExpireIn")} {toInteger(timer / 60.0)}:{timer % 60}{" "}
                {t("GoldWallet.TransactionSummaryModal.seconds")}
              </Typography.Text>
            ) : (
              <>
                <Typography.Text style={timerExpiredTextStyle}>
                  {t("GoldWallet.TransactionSummaryModal.priceExpired")}
                </Typography.Text>
                <Button size="mini" variant="primary-warning" onPress={handleOnRefreshTimerPress}>
                  <Typography.Text color="complimentBase">
                    {t("GoldWallet.TransactionSummaryModal.refresh")}
                  </Typography.Text>
                </Button>
              </>
            )}
          </>
        </Stack>

        <View style={confirmButtonStyle}>
          <View style={accordionStyle}>
            <Accordion
              title={t("GoldWallet.TransactionSummaryModal.whyPricesChange")}
              icon={<InfoCircleIcon color={infoIconColor.color} />}>
              <Typography.Text color="neutralBase+10" size="footnote">
                {t("GoldWallet.TransactionSummaryModal.goldPricesChanging")}
              </Typography.Text>
            </Accordion>
          </View>
          <Button onPress={() => onConfirm()}> {t("Home.DashboardScreen.GoalGetter.actionsSummary.confirm")}</Button>
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
