import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import ProgressWheel from "@//components/ProgressWheel";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import GoalAngledBorder from "../assets/GoalAngledBorder";

interface GoalCardProps {
  title: string;
  amountSaved: number;
  totalAmount: number;
  date: string;
  onPress: () => void;
}

export default function GoalCard({ title, amountSaved, totalAmount, date, onPress }: GoalCardProps) {
  const { t } = useTranslation();

  const isGoalCompleted = amountSaved >= totalAmount;

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
    theme => ({
      flexDirection: "row",
      backgroundColor: isGoalCompleted ? theme.palette["secondary_mintBase-10"] : theme.palette["primaryBase-70"],
      justifyContent: "center",
      padding: theme.spacing["16p"],
      paddingLeft: theme.spacing["4p"],
    }),
    [isGoalCompleted]
  );

  const angledBorderColor = useThemeStyles<string>(
    theme => (isGoalCompleted ? theme.palette["secondary_mintBase-10"] : theme.palette["primaryBase-70"]),
    [isGoalCompleted]
  );

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <View style={detailsContainerStyle}>
        <Typography.Text color="neutralBase+30" size="title3" weight="bold" style={goalTitleStyle}>
          {title}
        </Typography.Text>
        <Typography.Text size="footnote" weight="regular" color="neutralBase+30">
          {t("SavingsGoals.SavingsGoalsScreen.goalCard.amount", {
            amountSaved: formatCurrency(Number(amountSaved)),
            totalAmount: formatCurrency(Number(totalAmount)),
          })}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="caption2" weight="regular">
          {format(new Date(date), "d MMM yyyy")}
        </Typography.Text>
      </View>
      <View style={progressContainerStyle}>
        <View style={styles.AngledBorderStyle}>
          <GoalAngledBorder color={angledBorderColor} />
        </View>

        <ProgressWheel current={amountSaved} total={totalAmount} circleSize={64} textSize="footnote" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  AngledBorderStyle: {
    left: -24,
    position: "absolute",
  },
});
