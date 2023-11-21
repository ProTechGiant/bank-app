import { useTranslation } from "react-i18next";
import { Pressable, ViewStyle } from "react-native";

import { ProgressIndicator, Stack, Typography } from "@/components";
import { BulletinBoardSectionIcon } from "@/features/Home/components";
import { useThemeStyles } from "@/theme";

interface PendingGoalCardProps {
  completed: number;
  total: number;
  name: string;
  onPress: () => void;
}
export default function PendingGoalCard({ name, completed, total, onPress }: PendingGoalCardProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "white",
    marginTop: theme.spacing["24p"],
    marginHorizontal: theme.spacing["20p"],
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.small,
    shadowColor: theme.palette["neutralBase+30"],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
  }));
  return (
    <Stack direction="vertical" style={containerStyle}>
      <Typography.Text weight="bold">
        {total - completed} {t("GoalGetter.GoalDashboardScreen.pendingGoalCard.moreStep")}
        {total - completed === 1 ? null : "s"} {t("GoalGetter.GoalDashboardScreen.pendingGoalCard.towardsYour")} ({name}
        ) {t("GoalGetter.GoalDashboardScreen.exclamationMark")}
      </Typography.Text>
      <Stack direction="horizontal" align="center" gap="8p">
        <BulletinBoardSectionIcon />
        <Stack direction="vertical" align="stretch" gap="8p" flex={1}>
          <ProgressIndicator currentStep={completed} totalStep={total} />
          <Stack direction="horizontal" align="center" justify="space-between">
            <Typography.Text size="caption2" color="neutralBase+10">
              {completed} {t("GoalGetter.GoalDashboardScreen.pendingGoalCard.of")} {total}{" "}
              {t("GoalGetter.GoalDashboardScreen.pendingGoalCard.task")}
              {total === 1 ? null : "s"} {t("GoalGetter.GoalDashboardScreen.pendingGoalCard.completed")}
            </Typography.Text>
            <Pressable onPress={onPress}>
              <Typography.Text size="caption2" color="primaryBase-40">
                {t("GoalGetter.GoalDashboardScreen.pendingGoalCard.viewTasks")}
              </Typography.Text>
            </Pressable>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
