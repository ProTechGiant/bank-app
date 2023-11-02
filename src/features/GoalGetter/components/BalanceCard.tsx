import { useTranslation } from "react-i18next";
import { Pressable, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { GoalEditIcon } from "../assets/icons";

interface BalanceCardProps {
  goalAmount?: string;
  goalDuration?: string;
}

export default function BalanceCard({ goalAmount, goalDuration }: BalanceCardProps) {
  const { t } = useTranslation();

  const handleOnEditPress = () => {
    // TODO: add navigations
  };

  const balanceCardContainer = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["20p"],
    marginBottom: theme.spacing["24p"],
    borderRadius: theme.radii.medium,
    overflow: "hidden",
  }));

  const balanceAmountContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    backgroundColor: "#5E5C6B",
  }));

  const balanceDurationContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    backgroundColor: "#403D4A",
  }));

  // TODO: add data from api integrations
  return (
    <Stack direction="vertical" align="stretch" style={balanceCardContainer}>
      <Stack direction="horizontal" align="center" justify="space-between" style={balanceAmountContainer}>
        <Stack direction="vertical" gap="12p">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("GoalGetter.ShapeYourGoalScreen.goalAmount")}
          </Typography.Text>
          <Typography.Text size="title2" color="neutralBase-60" weight="bold">
            {goalAmount}
          </Typography.Text>
        </Stack>
        <Pressable onPress={handleOnEditPress}>
          <GoalEditIcon />
        </Pressable>
      </Stack>
      <Stack direction="horizontal" align="center" style={balanceDurationContainer}>
        <Stack direction="vertical" gap="16p">
          <Typography.Text size="footnote" color="neutralBase-60">
            {t("GoalGetter.ShapeYourGoalScreen.goalDuration")}
          </Typography.Text>
          <Typography.Text size="title2" color="neutralBase-60" weight="bold">
            {goalDuration}
          </Typography.Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
