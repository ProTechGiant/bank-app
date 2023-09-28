import { useTranslation } from "react-i18next";
import { TextStyle, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { Transaction } from "../types";
import LatestGoalTransactionItem from "./LatestGoalTransactionItem";

interface LatestTransactionSectionProps {
  onPressSeeMore: () => void;
  transactions: Transaction[];
}

export default function LatestTransactionSection({ onPressSeeMore, transactions }: LatestTransactionSectionProps) {
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
      <Stack direction="horizontal" justify="space-between">
        <Typography.Text size="callout" weight="medium" style={textStyle}>
          {t("GoalGetter.goalDetail.latestTransactions")}
        </Typography.Text>
        <Typography.Text size="caption1" weight="medium" style={textStyle} onPress={onPressSeeMore}>
          {t("GoalGetter.goalDetail.seeMore")}
        </Typography.Text>
      </Stack>
      {transactions.map(item => {
        return <LatestGoalTransactionItem title={item.Title} amount={item.Amount} subTitle={item.Date} />;
      })}
    </Stack>
  );
}
