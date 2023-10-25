import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, StyleSheet } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import useNavigation from "@/navigation/use-navigation";

import { mockProductKeyInformation } from "../mocks/mockProductKeyInformation";

export default function MutualFundBottomSection() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [hasArcApp, setHasArcApp] = useState(false);

  useEffect(() => {
    checkIfArcAppIsInstalled();
  }, []);

  const checkIfArcAppIsInstalled = async () => {
    try {
      // TODO: Replace with the actual deep linking URL for ios & android
      const url = "arcapp://path-to-redirect";
      const isArcAppInstalled = await Linking.canOpenURL(url);
      setHasArcApp(isArcAppInstalled);
    } catch (error) {
      console.error("An error occurred while checking if the ARC app is installed.", error);
    }
  };

  const handleOnRedeemClick = () => {
    if (hasArcApp) {
      // TODO: Replace with the actual deep linking URL ios & android
      Linking.openURL("arcapp://path-to-redirect");
    } else {
      // TODO: Replace with the actual URL ios & android
      Linking.openURL("https://play.google.com/store/apps");
    }
  };

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
          navigation.navigate("MutualFund.Subscription", { ProductKeyInformation: mockProductKeyInformation }); //TODO - when API is ready replace it with actual data
        }}>
        {t("MutualFund.MutualFundDetailsScreen.additionalSubscriptionButtonText")}
      </Button>
      <Button variant="tertiary" onPress={handleOnRedeemClick}>
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
