import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { MothlyContributionIcon } from "../assets/icons";
import { formatAmount } from "../utils";
import { parseGoalDetailDate } from "../utils/DateUtills";
import MonthlyContributionItem from "./MonthlyContributionItem";

interface PaymentInstructionsProps {
  minimumContribution: string;
  currency: string;
  upcomingContributionDate: string;
}

export default function PaymentInstructions({
  minimumContribution,
  currency,
  upcomingContributionDate,
}: PaymentInstructionsProps) {
  const [isToggleEnable, setToggleEnable] = useState<boolean>(true);

  const { t } = useTranslation();

  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
    marginBottom: theme.spacing["16p"],
    flex: 1,
    alignItems: "stretch",
  }));

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const handleToggle = () => {
    setToggleEnable(!isToggleEnable);
  };

  return (
    <Stack direction="vertical" style={contentStyles}>
      <Stack direction="horizontal" justify="space-between" align="center" style={titleStyle}>
        <Typography.Text size="callout" weight="medium">
          {t("GoalGetter.goalDetail.paymentInstructions")}
        </Typography.Text>
        <Toggle onPress={handleToggle} value={isToggleEnable} />
      </Stack>
      <MonthlyContributionItem
        title={t("GoalGetter.goalDetail.monthlyContribution")}
        subTitle={t("GoalGetter.goalDetail.dateUpcoming", { date_: parseGoalDetailDate(upcomingContributionDate) })}
        icon={<MothlyContributionIcon />}
        valueOnRight={`${formatAmount(Number(minimumContribution), false)} ${currency}`}
        isEnable={isToggleEnable}
      />
    </Stack>
  );
}
