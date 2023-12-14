import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

interface MutualFundModalProps {
  isVisible: boolean;
  changeVisibility: (status: boolean) => void;
  withdrawAmount: number;
  originalBalance: number;
  handleOnConfirmPress: () => void;
  remainingAmount: number;
}

export default function MutualFundModal({
  isVisible,
  changeVisibility,
  withdrawAmount,
  remainingAmount,
  originalBalance,
  handleOnConfirmPress,
}: MutualFundModalProps) {
  const { t } = useTranslation();

  const onConfirm = () => {
    handleOnConfirmPress();
  };

  const summaryDateStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderRadius: theme.radii.small,
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
          {t("Home.DashboardScreen.GoalGetter.actionsSummary.withDrawSummary")}
        </Typography.Text>
        <Stack direction="vertical" style={summaryDateStyle}>
          <Stack direction="vertical" style={summaryTableStyle}>
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.from")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.currentAccount")}
            </Typography.Text>
          </Stack>
          <Stack direction="vertical" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.to")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.alRajhiGrowthFund")}
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.originalBalance")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="bold">
              {originalBalance}
              <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                {" "}
                {t("Home.DashboardScreen.GoalGetter.actionsSummary.SAR")}
              </Typography.Text>
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {" "}
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.withdrawalAmount")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="bold">
              {withdrawAmount}
              <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                {t("Home.DashboardScreen.GoalGetter.actionsSummary.SAR")}
              </Typography.Text>
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" style={summaryTableStyle} justify="space-between">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.remainingBalance")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="bold">
              {remainingAmount}
              <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                {" "}
                {t("Home.DashboardScreen.GoalGetter.actionsSummary.SAR")}
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
