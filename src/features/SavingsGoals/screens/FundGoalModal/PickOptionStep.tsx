import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { LightningBoltIcon, RecurringEventIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import CardButton from "./CardButton";

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

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-30"],
  }));

  const buttonsContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
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
              <CardButton
                onPress={onRecommendedPaymentPress}
                icon={<RecurringEventIcon />}
                text={t("SavingsGoals.FundGoalModal.PickFundingMethodStep.recommended.amount", {
                  amount: recommendedAmount?.toLocaleString("en-US", { style: "decimal" }),
                })}
              />
            </View>
          )}
          <View>
            <Typography.Text size="callout" weight="medium" style={subTitleStyle}>
              {t("SavingsGoals.FundGoalModal.PickFundingMethodStep.custom.title")}
            </Typography.Text>
            <View style={buttonsContainer}>
              <CardButton
                onPress={onRecurringDepositPress}
                icon={<RecurringEventIcon />}
                text={t("SavingsGoals.FundGoalModal.PickFundingMethodStep.custom.recurringDeposits")}
              />
              <View style={separatorStyle} />
              <CardButton
                onPress={onOneTimePaymentPress}
                icon={<LightningBoltIcon />}
                text={t("SavingsGoals.FundGoalModal.PickFundingMethodStep.custom.oneTimeDeposit")}
              />
            </View>
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
