import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { LightningBoltIcon, RecurringEventIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface PickOptionStepProps {
  onCancelPress: () => void;
  onOneTimePaymentPress: () => void;
  onRecommendedPaymentPress: () => void;
  onRecurringDepositPress: () => void;
  recommendedAmount: number | undefined;
}

export default function PickOptionStep({
  onCancelPress,
  onOneTimePaymentPress,
  onRecommendedPaymentPress,
  onRecurringDepositPress,
  recommendedAmount,
}: PickOptionStepProps) {
  const { t } = useTranslation();

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  const subTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <>
      <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={onCancelPress} />} />
      <ContentContainer style={{ justifyContent: "space-between" }}>
        <View>
          <Typography.Text size="large" weight="bold" style={titleStyle}>
            {t("SavingsGoals.FundGoalModal.PickFundingMethodStep.title")}
          </Typography.Text>
          <Typography.Text size="callout" style={contentContainerStyle}>
            {t("SavingsGoals.FundGoalModal.PickFundingMethodStep.subText")}
          </Typography.Text>
          {typeof recommendedAmount === "number" && (
            <View style={contentContainerStyle}>
              <Typography.Text size="callout" weight="medium" style={subTitleStyle}>
                {t("SavingsGoals.FundGoalModal.PickFundingMethodStep.recommended.title")}
              </Typography.Text>
              <TableListCard
                end={<TableListCard.Chevron />}
                icon={<RecurringEventIcon />}
                onPress={onRecommendedPaymentPress}
                label={t("SavingsGoals.FundGoalModal.PickFundingMethodStep.recommended.amount", {
                  amount: recommendedAmount?.toLocaleString("en-US", { style: "decimal" }),
                })}
              />
            </View>
          )}
          <View>
            <Typography.Text size="callout" weight="medium" style={subTitleStyle}>
              {t("SavingsGoals.FundGoalModal.PickFundingMethodStep.custom.title")}
            </Typography.Text>
            <TableListCardGroup>
              <TableListCard
                end={<TableListCard.Chevron />}
                onPress={onRecurringDepositPress}
                icon={<RecurringEventIcon />}
                label={t("SavingsGoals.FundGoalModal.PickFundingMethodStep.custom.recurringDeposits")}
              />
              <TableListCard
                end={<TableListCard.Chevron />}
                onPress={onOneTimePaymentPress}
                icon={<LightningBoltIcon />}
                label={t("SavingsGoals.FundGoalModal.PickFundingMethodStep.custom.oneTimeDeposit")}
              />
            </TableListCardGroup>
          </View>
        </View>
        <View>
          <Button variant="tertiary" onPress={onCancelPress}>
            {t("SavingsGoals.FundGoalModal.PickFundingMethodStep.notNow")}
          </Button>
        </View>
      </ContentContainer>
    </>
  );
}
