import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, Text, TextStyle, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AllInOneCardParams } from "../AllInOneCardStack";
import { NeraTermsAndCondition, SelectCurrenciesModal, UpgradeNow } from "../components";
import SelectedCurrencies from "../components/SelectedCurrencies";
import { useAllInOneCardOTP } from "../hooks/query-hooks";
import { CardTypes } from "../types";

export default function PaymentScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.PaymentScreen">>();
  const selectedCurrencies = route.params?.selectedCurrencies || [];
  const addToast = useToasts();
  const { mutateAsync: sendAllInOneCardOTP } = useAllInOneCardOTP();
  const otpFlow = useOtpFlow();
  const { allInOneCardType, setMyCurrencies, myCurrencies } = useAuthContext();
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(true);
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setModalIsVisible(false);
    }, [])
  );

  const handleProceed = () => {
    try {
      otpFlow.handle({
        action: {
          to: "AllInOneCard.PaymentScreen",
          params: {
            selectedCurrencies: selectedCurrencies,
          },
        },
        otpVerifyMethod: "aio-card/addingCurrencies/otp-validation",
        // TODO: Add otpOptionalParams when api finished from BE team
        otpOptionalParams: {},
        onOtpRequest: () => {
          return sendAllInOneCardOTP();
        },
        onFinish: async status => {
          if (status === "success") {
            setMyCurrencies([...myCurrencies, ...selectedCurrencies]);
            navigation.navigate("Home.HomeTabs", { screen: "Cards" });
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

  const handleOnCancel = () => {
    setIsWarningModalVisible(false);
  };

  const handleOnExit = () => {
    setIsWarningModalVisible(false);
    navigation.navigate("AllInOneCard.MyCurrenciesScreen");
  };

  const titleStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.title1,
    fontWeight: theme.typography.text.weights.bold,
    color: "#01322A",
    padding: theme.spacing["24p"],
  }));

  const bottomContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    flex: 1,
    justifyContent: "flex-end",
    gap: theme.spacing["24p"],
  }));

  return (
    <Page>
      <NavHeader end={<NavHeader.CloseEndButton onPress={() => setIsWarningModalVisible(true)} />} />
      <StatusBar backgroundColor="#FAFAFA" />
      <View>
        <Text style={titleStyle}>{t("AllInOneCard.myCurrenciesScreens.payment")}</Text>
      </View>
      <SelectedCurrencies setModalIsVisible={setModalIsVisible} selectedCurrencies={selectedCurrencies} />
      {allInOneCardType === CardTypes.NERA ? <UpgradeNow /> : null}
      <SelectCurrenciesModal
        modalIsVisible={modalIsVisible}
        setModalIsVisible={setModalIsVisible}
        myCurrencies={selectedCurrencies}
      />
      <View style={bottomContainerStyle}>
        <NeraTermsAndCondition hasAgreedToTerms={hasAgreedToTerms} setHasAgreedToTerms={setHasAgreedToTerms} />
        <NotificationModal
          variant="warning"
          title={t("AllInOneCard.myCurrenciesScreens.warningMessage")}
          isVisible={isWarningModalVisible}
          onClose={() => setIsWarningModalVisible(false)}
          buttons={{
            primary: <Button onPress={handleOnExit}>{t("AllInOneCard.myCurrenciesScreens.exit")}</Button>,
            secondary: <Button onPress={handleOnCancel}>{t("AllInOneCard.myCurrenciesScreens.cancel")}</Button>,
          }}
        />
        <Button disabled={!hasAgreedToTerms} onPress={handleProceed}>
          {t("AllInOneCard.myCurrenciesScreens.proceed")}
        </Button>
      </View>
    </Page>
  );
}
