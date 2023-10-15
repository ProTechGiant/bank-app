import { StackActions } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { ProgressIndicator, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";

import { PaymentOptionsList } from "../components";
import { paymentOptions } from "../mocks/index";

export default function SelectPaymentOptionScreen() {
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<number>(0);

  const handleOnSelectPredefinedRisk = (value: number) => {
    setSelectedPaymentOption(value);
  };

  //TODO : navigate When page be ready
  const handleOnContinue = () => {
    // navigation.navigate("OrderSummaryScreen");
  };

  const handleOnCancelRedemption = () => {
    navigation.dispatch(StackActions.pop(3));
    navigation.navigate("Home.DashboardScreen");
  };

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
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
              <View>
                <PaymentOptionsList
                  optionsList={paymentOptions}
                  onSelectOptions={handleOnSelectPredefinedRisk}
                  predefinedValue={selectedPaymentOption}
                />
              </View>
            </View>
            <Button color="light" onPress={handleOnContinue} disabled={selectedPaymentOption === 0}>
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
    </Page>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressIndicator: { width: "80%" },
});
