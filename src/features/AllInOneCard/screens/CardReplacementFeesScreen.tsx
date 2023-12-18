import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useAccount from "@/hooks/use-account";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import ReplacementCardIcon from "../assets/icons/ReplacementCardIcon.svg";
import { FormattedPrice } from "../components";
import { useAllInOneCardOTP } from "../hooks/query-hooks";
import { feesReplacement } from "../mocks";

export default function CardReplacementFeesScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const otpFlow = useOtpFlow();
  const addToast = useToasts();
  const otpAIO = useAllInOneCardOTP();
  const { data: { currentAccountBalance = 0 } = {} } = useAccount();
  const [hasInsufficientFunds, setHasInsufficientFunds] = useState<boolean>(false);

  const handleOnConfirm = () => {
    if (currentAccountBalance < +feesReplacement.totalAmount) {
      setHasInsufficientFunds(true);
      return;
    }
    try {
      otpFlow.handle({
        action: {
          to: "AllInOneCard.CardReplacementFeesScreen",
        },
        otpVerifyMethod: "aio-card/closure/validate",
        // TODO: Add otpOptionalParams when api finished from BE team
        onOtpRequest: async () => {
          return await otpAIO.mutateAsync();
        },
        onFinish: async status => {
          if (status === "success") {
            navigation.navigate("AllInOneCard.RequestSuccessfullyScreen", {
              title: t("AllInOneCard.ReplacementCardScreen.successRequest.title"),
              description: t("AllInOneCard.ReplacementCardScreen.successRequest.description"),
              buttonText: t("AllInOneCard.ReplacementCardScreen.successRequest.buttonText"),
              onPress: () => {
                navigation.navigate("AllInOneCard.CreatePINScreen");
              },
              imageLogo: <ReplacementCardIcon />,
            });
          }
          if (status === "fail") {
            addToast({
              variant: "warning",
              message: t("AllInOneCard.ActivatedCardScreen.subscriptionFailed"),
            });
          }
        },
      });
    } catch (error) {
      warn("All In One Card", "error subscribing to All In One Card", JSON.stringify(error));
    }
  };

  const containerBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["24p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.regular,
  }));
  const insideContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));
  const borderBottomInside = useThemeStyles<ViewStyle>(theme => ({
    borderBottomWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    width: "100%",
  }));
  const errorMessageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    padding: theme.spacing["20p"],
    backgroundColor: theme.palette["errorBase-30"],
  }));
  const textContainerStyle = useThemeStyles<TextStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "space-between",
    paddingTop: theme.spacing["24p"],
    paddingBottom: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" testID="AllInOneCard.CardReplacementFeesScreen:Page">
      <NavHeader testID="AllInOneCard.CardReplacementFeesScreen:NavHeader" />
      <View style={containerStyle}>
        <View>
          <Typography.Text
            testID="AllInOneCard.CardReplacementFeesScreen:Title"
            size="title1"
            weight="medium"
            color="neutralBase+30"
            style={textContainerStyle}>
            {t("AllInOneCard.ReplacementCardScreen.feesScreen.title")}
          </Typography.Text>
          <Stack direction="vertical" style={containerBoxStyle}>
            <Stack direction="vertical" gap="4p" style={[insideContainerStyle, borderBottomInside]}>
              <Typography.Text size="footnote" color="neutralBase">
                {t("AllInOneCard.ReplacementCardScreen.feesScreen.chargedFrom")}
              </Typography.Text>
              <Typography.Text size="footnote">
                {t("AllInOneCard.ReplacementCardScreen.feesScreen.mainAccount")}
              </Typography.Text>
            </Stack>
            <Stack direction="vertical" gap="12p" style={[insideContainerStyle, borderBottomInside]}>
              <Stack direction="horizontal" justify="space-between" style={styles.fullWidth}>
                <Typography.Text size="footnote" color="neutralBase">
                  {t("AllInOneCard.ReplacementCardScreen.feesScreen.replacementFee")}
                </Typography.Text>
                <Typography.Text size="footnote">
                  {feesReplacement.replacementFee} {t("AllInOneCard.ReplacementCardScreen.feesScreen.sar")}
                </Typography.Text>
              </Stack>
              <Stack direction="horizontal" justify="space-between" style={styles.fullWidth}>
                <Typography.Text size="footnote" color="neutralBase">
                  {t("AllInOneCard.ReplacementCardScreen.feesScreen.vat")}
                </Typography.Text>
                <Typography.Text size="footnote">
                  {feesReplacement.vat} {t("AllInOneCard.ReplacementCardScreen.feesScreen.sar")}
                </Typography.Text>
              </Stack>
            </Stack>
            <Stack direction="horizontal" justify="space-between" style={[styles.fullWidth, insideContainerStyle]}>
              <Typography.Text size="callout" weight="medium">
                {t("AllInOneCard.ReplacementCardScreen.feesScreen.total")}
              </Typography.Text>
              <Stack direction="horizontal">
                <FormattedPrice price={feesReplacement.totalAmount} />
                <Typography.Text size="callout" weight="medium">
                  {t("AllInOneCard.ReplacementCardScreen.feesScreen.sar")}
                </Typography.Text>
              </Stack>
            </Stack>
          </Stack>
          {hasInsufficientFunds ? (
            <View style={errorMessageContainerStyle}>
              <Typography.Text size="footnote" color="errorBase">
                {t("AllInOneCard.ReplacementCardScreen.feesScreen.errorMessage")}
              </Typography.Text>
            </View>
          ) : null}
        </View>
        <View style={textContainerStyle}>
          <Button
            testID="AllInOneCard.CardReplacementFeesScreen:Button"
            onPress={handleOnConfirm}
            disabled={hasInsufficientFunds}>
            {t("AllInOneCard.ReplacementCardScreen.feesScreen.buttonText")}
          </Button>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
});
