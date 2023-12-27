import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ProgressWheel from "@/components/ProgressWheel";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import BudgetAngledBorder from "../assets/BudgetAngledBorder";

interface MonthlyBudgetProps {
  onPress: () => void;
}

export default function MonthlyBudget({ onPress }: MonthlyBudgetProps) {
  const { t } = useTranslation();

  const createBudgetStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    paddingLeft: theme.spacing["16p"],
    paddingRight: theme.spacing["24p"],
    paddingVertical: theme.spacing["16p"],
    borderRadius: theme.radii.medium,
    overflow: "hidden",
  }));

  return (
    <Stack direction="horizontal" justify="space-between" style={createBudgetStyle} align="center">
      <Stack direction="vertical" gap="12p" style={styles.textStackStyle}>
        <Stack gap="4p" direction="vertical">
          <Typography.Text color="neutralBase+30" size="title3" weight="medium">
            {t("TopSpending.TopSpendingScreen.CreateNewMonthlyBudget")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="caption1" weight="regular">
            {t("TopSpending.TopSpendingScreen.subMessage")}
          </Typography.Text>
        </Stack>
        <Button onPress={onPress} size="mini">
          {t("TopSpending.TopSpendingScreen.setBudgetButton")}
        </Button>
      </Stack>
      <ProgressWheel isbudgetProgress current={0} total={100} circleSize={64} textSize="footnote" showAddIcon={true} />
      <View style={styles.angledBorderStyle}>
        <BudgetAngledBorder />
      </View>
    </Stack>
  );
}

const styles = StyleSheet.create({
  angledBorderStyle: {
    position: "absolute",
    right: 0,
    transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }],
    zIndex: -1,
  },
  textStackStyle: { width: "60%" },
});
