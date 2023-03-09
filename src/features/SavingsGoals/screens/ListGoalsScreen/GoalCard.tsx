import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import ProgressWheel from "./ProgressWheel";

interface GoalCardProps {
  title: string;
  amountSaved: number;
  totalAmount: number;
  date: string;
  onPress: () => void;
}

const formatter = Intl.NumberFormat("en-US");
export default function GoalCard({ title, amountSaved, totalAmount, date, onPress }: GoalCardProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    padding: theme.spacing["12p"],
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.extraSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: theme.palette.primaryBase,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.14,
    elevation: 5,
  }));

  const goalTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <View style={styles.goalInfoContainer}>
        <Typography.Text color="neutralBase+30" size="callout" weight="semiBold" style={goalTitleStyle}>
          {title}
        </Typography.Text>
        <Typography.Text
          size="footnote"
          weight="medium"
          color={amountSaved === totalAmount ? "complimentBase" : "neutralBase+30"}>
          {t("SavingsGoals.SavingsGoalsScreen.goalCard.amount", {
            amountSaved: formatter.format(Number(amountSaved)),
            totalAmount: formatter.format(Number(totalAmount)),
          })}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="footnote">
          {format(new Date(date), "d MMM, yyyy")}
        </Typography.Text>
      </View>
      <ProgressWheel current={amountSaved} total={totalAmount} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  goalInfoContainer: {
    flex: 1,
  },
});
