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
import { FREE_WALLET_LIMIT_FOR_NERA, FREE_WALLET_LIMIT_FOR_NERA_PLUS } from "../constants";
import { useValidateAddCurrencies } from "../hooks/query-hooks";
import { AddCurrenciesRequest, CardTypes } from "../types";

export default function PaymentScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.PaymentScreen">>();
  const selectedCurrencies = route.params.selectedCurrencies;
  const myCurrencies = route.params?.myCurrencies || [];
  const addToast = useToasts();
  const { mutateAsync: AddCurrencies, isLoading: isAddCurrenciesLoading } = useValidateAddCurrencies();
  const otpFlow = useOtpFlow();
  const { allInOneCardType, setMyCurrencies } = useAuthContext();
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(true);
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const freeWalletLimit =
    allInOneCardType === CardTypes.NERA ? FREE_WALLET_LIMIT_FOR_NERA : FREE_WALLET_LIMIT_FOR_NERA_PLUS;
  const totalCurrencies = myCurrencies.length + selectedCurrencies.length;
  let paidCurrencies = 0;
  if (totalCurrencies > freeWalletLimit) {
    if (myCurrencies.length > freeWalletLimit) {
      paidCurrencies = selectedCurrencies.length;
    } else {
      paidCurrencies = totalCurrencies - freeWalletLimit;
    }
  }
  //Todo: uncomment when api ready
  // const currenciesFeesAfterDiscount = (paidCurrencies * 15).toFixed(2);
  // const vat = (+currenciesFeesAfterDiscount * 0.15).toFixed(2);
  // const totalFees = +currenciesFeesAfterDiscount + +vat;

  useFocusEffect(
    useCallback(() => {
      setModalIsVisible(false);
    }, [])
  );

  const handleProceed = async () => {
    const payload: AddCurrenciesRequest = {
      CardId: "43e1da79-8e63-4a55-b87d-3871bb9e9dca", //Todo: change to real card id when api ready
      CardIdType: "EXID",
      Reason: "Add Currency",
      CurrenciesList: selectedCurrencies.map(currency => currency.CurrencyCode),
      NoOfAllCurrencies: selectedCurrencies.length,
      NoOfFreeCurrencies: selectedCurrencies.length - paidCurrencies,
      NoOfPaidCurrencies: paidCurrencies,
      //TODO: change to real values when api ready
      Fees: "4.00",
      Vat: "0.60",
      TotalAmount: "4.60",
    };

    try {
      const res = await AddCurrencies(payload);
      if (res.IsOtpRequired) {
        otpFlow.handle({
          action: {
            to: "AllInOneCard.PaymentScreen",
            params: {
              selectedCurrencies: selectedCurrencies,
            },
          },
          otpVerifyMethod: "aio-card/currencies/otp-validation",
          // TODO: Add otpOptionalParams when api finished from BE team
          otpChallengeParams: {
            OtpId: res.OtpId!,
          },
          onFinish: async status => {
            if (status === "success") {
              setMyCurrencies([...myCurrencies, ...selectedCurrencies]);
              navigation.navigate("Home.HomeTabs", { screen: "Cards" });
            }
            if (status === "fail") {
              addToast({
                variant: "warning",
                message: t("AllInOneCard.myCurrenciesScreens.failed"),
              });
            }
          },
        });
      } else {
        setMyCurrencies([...myCurrencies, ...selectedCurrencies]);
        navigation.navigate("Home.HomeTabs", { screen: "Cards" });
      }
    } catch (error) {
      warn("All In One Card", "Currency payment error", JSON.stringify(error));
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
      <SelectedCurrencies
        setModalIsVisible={setModalIsVisible}
        selectedCurrencies={selectedCurrencies}
        myCurrencies={myCurrencies}
      />
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
        <Button disabled={!hasAgreedToTerms} onPress={handleProceed} loading={isAddCurrenciesLoading}>
          {t("AllInOneCard.myCurrenciesScreens.proceed")}
        </Button>
      </View>
    </Page>
  );
}
