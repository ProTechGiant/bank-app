import { StackActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { ProgressIndicator, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";

import { InfoBox, PaymentOptionsList } from "../components";
import { PAYMENT_METHOD_ANNUAL } from "../constants";
import { useAllInOneCardContext } from "../contexts/AllInOneCardContext";
import { useGetPaymentsMethod } from "../hooks/query-hooks";

export default function SelectPaymentOptionScreen() {
  const { setContextState, paymentPlanId } = useAllInOneCardContext();
  //Todo : replace with real data when api is ready
  const { data: paymentsMethod, isLoading } = useGetPaymentsMethod({
    productId: "1",
    channelId: "1",
  });
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>();

  useEffect(() => {
    if (paymentPlanId) setSelectedPaymentOption(paymentPlanId);
  }, [paymentPlanId]);

  const handleOnSelectPredefinedRisk = (value: string) => {
    setSelectedPaymentOption(value);
  };

  const handleOnContinue = () => {
    setContextState({
      paymentPlan: selectedPaymentOption === PAYMENT_METHOD_ANNUAL ? "yearly" : "monthly",
      paymentPlanId: paymentsMethod?.PricePlans.find(item => item.Code === selectedPaymentOption)?.Id.toString(),
      paymentPlanCode: paymentsMethod?.PricePlans.find(item => item.Code === selectedPaymentOption)?.Code.toString(),
    });
    navigation.navigate("AllInOneCard.CardReview");
  };

  const handleOnCancelRedemption = () => {
    navigation.dispatch(StackActions.pop(3));
    navigation.navigate("Home.DashboardScreen");
  };

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
  }));

  const infoBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={2} totalStep={3} />
          </View>
        }
        end={<NavHeader.CloseEndButton onPress={() => setIsWarningModalVisible(true)} />}
      />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <ContentContainer isScrollView>
          <View style={styles.container}>
            <Stack direction="vertical" justify="space-between" align="stretch" flex={1}>
              <View>
                <Typography.Text
                  size="title1"
                  weight="bold"
                  align="left"
                  style={headerContainerStyle}
                  color="neutralBase+30">
                  {t("AllInOneCard.SelectPaymentOptionScreen.title")}
                </Typography.Text>
                <Typography.Text size="callout" weight="regular" align="left">
                  {t("AllInOneCard.SelectPaymentOptionScreen.description")}
                </Typography.Text>
                {paymentsMethod !== undefined && (
                  <View>
                    <PaymentOptionsList
                      optionsList={paymentsMethod.PricePlans}
                      onSelectOptions={handleOnSelectPredefinedRisk}
                      predefinedValue={selectedPaymentOption}
                    />
                  </View>
                )}

                <View style={infoBoxStyle}>
                  <InfoBox
                    description={t("AllInOneCard.SelectPaymentOptionScreen.infoBoxDescription")}
                    color="complimentBase-10"
                  />
                </View>
              </View>

              <Button color="light" onPress={handleOnContinue} disabled={selectedPaymentOption === undefined}>
                {t("AllInOneCard.SelectPaymentOptionScreen.continue")}
              </Button>
            </Stack>
          </View>
          <NotificationModal
            variant="warning"
            title={t("AllInOneCard.SelectPaymentOptionScreen.warningModal.title")}
            message={t("AllInOneCard.SelectPaymentOptionScreen.warningModal.message")}
            isVisible={isWarningModalVisible}
            onClose={() => setIsWarningModalVisible(false)}
            buttons={{
              primary: (
                <Button onPress={handleOnCancelRedemption}>
                  {t("AllInOneCard.SelectPaymentOptionScreen.warningModal.CancelButton")}
                </Button>
              ),
            }}
          />
        </ContentContainer>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressIndicator: { width: "80%" },
});
