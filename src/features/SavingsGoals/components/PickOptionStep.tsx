import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { LightningBoltIcon, RecurringEventIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import List from "@/components/List";
import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface PickOptionStepProps {
  onCancelPress: () => void;
  onOneOffPaymentPress: () => void;
  onRecommendedPaymentPress: () => void;
  onRecurringPaymentsPress: () => void;
  recommendedAmount: number | undefined;
}

export default function PickOptionStep({
  onCancelPress,
  onOneOffPaymentPress,
  onRecommendedPaymentPress,
  onRecurringPaymentsPress,
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
      <NavHeader
        withBackButton={false}
        end={<NavHeader.CloseEndButton onPress={onCancelPress} />}
        testID="SavingsGoals.FundGoalModal:NavHeader-PickOptionStep"
      />
      <ContentContainer style={styles.container}>
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
              <List isBordered>
                <List.Item.Primary
                  end={<List.End.Chevron />}
                  icon={<RecurringEventIcon />}
                  onPress={onRecommendedPaymentPress}
                  label={t("SavingsGoals.FundGoalModal.PickFundingMethodStep.recommended.amount", {
                    amount: recommendedAmount?.toLocaleString("en-US", { style: "decimal" }),
                  })}
                  testID="SavingsGoals.FundGoalModal:SelectRecommendedAmountButton"
                />
              </List>
            </View>
          )}
          <View>
            <Typography.Text size="callout" weight="medium" style={subTitleStyle}>
              {t("SavingsGoals.FundGoalModal.PickFundingMethodStep.custom.title")}
            </Typography.Text>
            <List isBordered>
              <List.Item.Primary
                end={<List.End.Chevron />}
                onPress={onRecurringPaymentsPress}
                icon={<RecurringEventIcon />}
                label={t("SavingsGoals.FundGoalModal.PickFundingMethodStep.custom.regularPayments")}
                testID="SavingsGoals.FundGoalModal:RecurringPaymentsButton"
              />
              <List.Item.Primary
                end={<List.End.Chevron />}
                onPress={onOneOffPaymentPress}
                icon={<LightningBoltIcon />}
                label={t("SavingsGoals.FundGoalModal.PickFundingMethodStep.custom.oneOffPayment")}
                testID="SavingsGoals.FundGoalModal:OneOffPaymentButton"
              />
            </List>
          </View>
        </View>
        <Button variant="tertiary" onPress={onCancelPress} testID="SavingsGoals.FundGoalModal:CancelButton">
          {t("SavingsGoals.FundGoalModal.PickFundingMethodStep.notNow")}
        </Button>
      </ContentContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
});
