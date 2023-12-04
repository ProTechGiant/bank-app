import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import ProgressWheel from "@/components/ProgressWheel";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import BudgetAngledBorder from "../assets/BudgetAngledBorder";

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

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.small,
  }));

  const detailsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 1,
    flex: 1,
    borderTopLeftRadius: theme.radii.small,
    borderBottomLeftRadius: theme.radii.small,
  }));

  const goalTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const progressContainerStyle = useThemeStyles<ViewStyle>(
    theme => {
      let color;
      if (percentage === 0 || (percentage >= 1 && percentage <= 49)) {
        color = theme.palette["secondary_mintBase-20"];
      } else if ((percentage >= 50 && percentage <= 59) || (percentage >= 60 && percentage <= 89)) {
        color = theme.palette["secondary_yellowBase-30"];
      } else if ((percentage >= 90 && percentage <= 99) || percentage >= 100) {
        color = theme.palette["secondary_pinkBase-30"];
      }

      return {
        flexDirection: "row",
        backgroundColor: color,
        justifyContent: "center",
        padding: theme.spacing["16p"],
        paddingLeft: theme.spacing["4p"],
      };
    },
    [percentage]
  );

  const angledBorderColor = useThemeStyles<string | undefined>(
    theme => {
      let color;
      if (percentage === 0 || (percentage >= 1 && percentage <= 49)) {
        color = theme.palette["secondary_mintBase-20"];
      } else if ((percentage >= 50 && percentage <= 59) || (percentage >= 60 && percentage <= 89)) {
        color = theme.palette["secondary_yellowBase-20"];
      } else if ((percentage >= 90 && percentage <= 99) || percentage >= 100) {
        color = theme.palette["secondary_pinkBase-30"];
      }
      return color;
    },
    [percentage]
  );

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <View style={detailsContainerStyle}>
        <Typography.Text color="neutralBase+30" size="title3" weight="bold" style={goalTitleStyle}>
          {titleText}
        </Typography.Text>
        <Typography.Text size="footnote" weight="regular" color="neutralBase+30">
          {t("TopSpending.TopSpendingScreen.budgetCard.amount", {
            amountSpent: formatCurrency(Number(amountSpent)),
            budgetAmount: formatCurrency(Number(budgetAmount)),
          })}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="caption2" weight="regular">
          {format(new Date(fromDate), "d MMM yyyy")} - {format(new Date(toDate), "d MMM yyyy")}
        </Typography.Text>
      </View>
      <View style={progressContainerStyle}>
        <View style={styles.angledBorderStyle}>
          <BudgetAngledBorder color={angledBorderColor} />
        </View>

        <ProgressWheel
          isbudgetProgress
          current={amountSpent}
          total={budgetAmount}
          circleSize={64}
          textSize="footnote"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  angledBorderStyle: {
    // 'left: -24' is used to nudge the view 24 pixels to the left for optimal visual positioning.
    left: -16,
    position: "absolute",
    transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }],
  },
});
