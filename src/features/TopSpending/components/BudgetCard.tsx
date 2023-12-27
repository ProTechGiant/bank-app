import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { Stack } from "@/components";
import ProgressWheel from "@/components/ProgressWheel";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import BudgetAngledBorder from "../assets/BudgetAngledBorder";
import { EditRoundedIcon } from "../assets/icons";

interface BudgetCardProps {
  percentage: number;
  amountSpent: number;
  budgetAmount: number;
  fromDate: string;
  toDate: string;
  onPress: () => void;
}

export default function BudgetCard({
  percentage,
  amountSpent,
  budgetAmount,
  fromDate,
  toDate,
  onPress,
}: BudgetCardProps) {
  const { t } = useTranslation();

  let titleText;

  if (percentage === 0) {
    titleText = t("TopSpending.TopSpendingScreen.gettingStarted");
  } else if (percentage > 0 && percentage <= 49) {
    titleText = t("TopSpending.TopSpendingScreen.onRightTrack");
  } else if (percentage >= 50 && percentage <= 59) {
    titleText = t("TopSpending.TopSpendingScreen.halfwayThrough");
  } else if (percentage >= 60 && percentage <= 89) {
    titleText = t("TopSpending.TopSpendingScreen.moreThanHalfwayThrough");
  } else if (percentage >= 90 && percentage < 100) {
    titleText = t("TopSpending.TopSpendingScreen.aboutToHitBuget");
  } else if (percentage >= 100) {
    titleText = t("TopSpending.TopSpendingScreen.reachedBudget");
  }

  const progressColor = useThemeStyles<string | undefined>(
    theme => {
      let color;
      if (percentage === 0 || (percentage >= 1 && percentage <= 49)) {
        color = theme.palette["primaryBase-70"];
      } else if (percentage >= 50 && percentage <= 59) {
        color = theme.palette.secondary_blueBase;
      } else if (percentage >= 60 && percentage <= 89) {
        color = theme.palette["warningBase-10"];
      } else if ((percentage >= 90 && percentage <= 99) || percentage === 100) {
        color = theme.palette["errorBase-10"];
      }
      return color;
    },
    [percentage]
  );

  const createBudgetStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    paddingLeft: !I18nManager.isRTL ? theme.spacing["16p"] : theme.spacing["24p"],
    paddingRight: !I18nManager.isRTL ? theme.spacing["24p"] : theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
    borderRadius: theme.radii.medium,
    overflow: "hidden",
  }));

  const budgetAngledBorderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  const editIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  return (
    <Stack direction="horizontal" justify="space-between" style={createBudgetStyle} align="center">
      <Stack direction="vertical" gap="32p">
        <Stack direction="vertical" gap="4p">
          <Typography.Text color="neutralBase+30" size="title3" weight="medium">
            {t("TopSpending.TopSpendingScreen.CreateNewMonthlyBudget")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {titleText}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="footnote" weight="medium" color="neutralBase+30">
            {t("TopSpending.TopSpendingScreen.budgetCard.amount", {
              amountSpent: formatCurrency(Number(amountSpent)),
              budgetAmount: formatCurrency(Number(budgetAmount)),
            })}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="caption1" weight="regular">
            {format(new Date(fromDate), "d MMM yyyy")} - {format(new Date(toDate), "d MMM yyyy")}
          </Typography.Text>
        </Stack>
      </Stack>
      <ProgressWheel
        progressColor={progressColor}
        isbudgetProgress
        current={amountSpent}
        total={budgetAmount}
        circleSize={64}
        textSize="footnote"
        textColor="neutralBase-60"
        lightStrokeBackgroundColor={true}
      />
      <View style={styles.angledBorderStyle}>
        <BudgetAngledBorder color={budgetAngledBorderColor} />
      </View>
      <Pressable onPress={onPress} style={styles.editIconViewStyle}>
        <EditRoundedIcon color={editIconColor} />
      </Pressable>
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
  editIconViewStyle: {
    position: "absolute",
    right: 10,
    top: 10,
    transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }],
    zIndex: 2,
  },
});
