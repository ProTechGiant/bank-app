import { useTranslation } from "react-i18next";
import { TextStyle, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { EndDateIcon, InitialContributionIcon, StartDateIcon } from "../assets/icons";
import { parseGoalDetailDate } from "../utils/DateUtills";
import MonthlyContributionItem from "./MonthlyContributionItem";

interface GoalDetailsProps {
  initialContribution: string;
  startDate: string;
  endDate: string;
  currency: string;
}

export default function GoalDetails({ initialContribution, startDate, endDate, currency }: GoalDetailsProps) {
  const { t } = useTranslation();

  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    flex: 1,
    alignItems: "stretch",
  }));

  const textStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <Stack direction="vertical" style={contentStyles}>
      <Typography.Text size="callout" weight="medium" style={textStyle}>
        {t("GoalGetter.goalDetail.detail")}
      </Typography.Text>
      <MonthlyContributionItem
        title={t("GoalGetter.goalDetail.initialContribution")}
        icon={<InitialContributionIcon />}
        valueOnRight={`${initialContribution} ${currency}`}
      />
      <MonthlyContributionItem
        title={t("GoalGetter.goalDetail.startDate")}
        icon={<StartDateIcon />}
        valueOnRight={parseGoalDetailDate(startDate)}
      />
      <MonthlyContributionItem
        title={t("GoalGetter.goalDetail.endDate")}
        icon={<EndDateIcon />}
        valueOnRight={parseGoalDetailDate(endDate)}
      />
    </Stack>
  );
}
