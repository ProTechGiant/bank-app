import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import useNavigation from "@/navigation/use-navigation";

export default function MutualFundBottomSection() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Stack direction="vertical" align="stretch" gap="8p">
      <Button
        variant="tertiary"
        onPress={() => {
          navigation.navigate("MutualFund.TermsAndConditions");
        }}>
        <Typography.Text color="neutralBase" size="footnote" weight="regular">
          {t("MutualFund.MutualFundDetailsScreen.view")}
          <Typography.Text color="primaryBase" size="footnote" weight="medium" style={styles.termsAndConditionsLink}>
            {t("MutualFund.MutualFundDetailsScreen.TermsAndConditions")}
          </Typography.Text>
        </Typography.Text>
      </Button>

      <Button
        onPress={() => {
          navigation.navigate("MutualFund.Subscription");
        }}>
        {t("MutualFund.MutualFundDetailsScreen.additionalSubscriptionButtonText")}
      </Button>
      <Button
        variant="tertiary"
        onPress={() => {
          navigation.navigate("MutualFund.Subscription");
        }}>
        {t("MutualFund.MutualFundDetailsScreen.redeemButtonText")}
      </Button>
    </Stack>
  );
}

const styles = StyleSheet.create({
  termsAndConditionsLink: {
    textDecorationLine: "underline",
  },
});
