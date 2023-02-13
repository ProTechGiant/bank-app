import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
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

export default function GoalCard({ title, amountSaved, totalAmount, date, onPress }: GoalCardProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  }));

  const goalTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" justify="space-between" style={containerStyle}>
        <View>
          <View style={goalTitleStyle}>
            <Typography.Text size="callout" weight="semiBold">
              {title}
            </Typography.Text>
          </View>
          <Typography.Text
            size="footnote"
            weight="medium"
            color={amountSaved !== 0 ? "complimentBase" : "neutralBase+30"}>
            {t("SavingsGoals.SavingsGoalsScreen.goalCard.amount", {
              amountSaved: amountSaved,
              totalAmount: totalAmount,
            })}
          </Typography.Text>
          <Typography.Text size="footnote" color="neutralBase">
            {format(new Date(date), "d MMM, yyyy")}
          </Typography.Text>
        </View>
        <ProgressWheel current={amountSaved} total={totalAmount} />
      </Stack>
    </Pressable>
  );
}
