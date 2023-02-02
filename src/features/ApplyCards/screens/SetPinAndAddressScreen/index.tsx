import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Dimensions, Keyboard, Platform, ScrollView, StyleSheet, TextInput, View } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import useNavigation from "@/navigation/use-navigation";

import { Address, useOrderCardContext } from "../../context/OrderCardContext";
import CardDeliveryDetails from "./CardDeliveryDetails";
import useGetPrimaryAddress from "./CardDeliveryDetails/use-get-primary-address";
import CreateCardPin from "./CreateCardPin";
import isValidPincode from "./CreateCardPin/is-valid-pincode";
import encryptPincode from "./encrypt-pincode";
import westernArabicNumerals from "./western-arabic-numerals";

const PIN_INPUT_LENGTH = 4;
const PIN_MAX_TRIES = 3;

export default function SetPinAndAddressScreen() {
  const { t } = useTranslation();
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();
  const getPrimaryAddress = useGetPrimaryAddress();
  const navigation = useNavigation();

  const textInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const [currentInput, setCurrentInput] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [mode, setMode] = useState<"input" | "confirm" | "address">("input");
  const [remainingTries, setRemainingTries] = useState(PIN_MAX_TRIES);
  const [selectedPincode, setSelectedPincode] = useState("");
  const [showErrorBox, setShowErrorBox] = useState(false);
  const [showApiErrorAlert, setShowApiErrorAlert] = useState(false);
  const [primaryAddress, setPrimaryAddress] = useState<Address | undefined>();

  const GENERIC_ERROR = {
    name: "error",
    title: t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.error.title"),
    message: t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.error.message"),
  };

  const handleOnInputPress = () => {
    textInputRef.current?.focus();
  };

  React.useEffect(() => {
    if (Platform.OS === "android") {
      const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
        textInputRef.current?.blur();
      });
      return () => {
        keyboardDidHideListener.remove();
      };
    }
  }, []);

  const handleOnChangeText = (input: string) => {
    setCurrentInput(input);

    if (PIN_INPUT_LENGTH !== input.length) return;
    const normalizedValue = westernArabicNumerals(input);

    if (mode === "input") {
      if (!isValidPincode(normalizedValue)) {
        return Alert.alert(
          t("ApplyCards.SetPinAndAddressScreen.SetPin.alert.title"),
          t("ApplyCards.SetPinAndAddressScreen.SetPin.alert.content"),
          [
            {
              text: t("ApplyCards.SetPinAndAddressScreen.SetPin.alert.button"),
              onPress: () => handleOnResetPincode(),
              style: "default",
            },
          ]
        );
      }

      setSelectedPincode(normalizedValue);
      setCurrentInput("");
      setMode("confirm");
    }

    if (mode === "confirm") {
      if (normalizedValue !== selectedPincode) {
        setRemainingTries(c => c - 1);
        setShowErrorBox(true);
        setIsValid(false);

        if (remainingTries - 1 > 0) {
          setCurrentInput("");
        }
      }

      if (normalizedValue === selectedPincode) {
        setIsValid(true);

        setOrderCardValues({
          ...orderCardValues,
          formValues: { ...orderCardValues.formValues, pin: encryptPincode(normalizedValue) },
        });

        setImmediate(() => handleOnResetPincode());
        setMode("address");
        if (showApiErrorAlert) {
          showErrorAlert(GENERIC_ERROR.title, GENERIC_ERROR.message);
        }
      }
    }
  };

  const showErrorAlert = (title: string, content: string) => {
    Alert.alert(title, content, [
      {
        text: "OK",
        onPress: () => navigation.navigate("Temporary.LandingScreen"),
      },
    ]);
  };

  useEffect(() => {
    const retrievePrimaryAddress = async () => {
      try {
        const response = await getPrimaryAddress.mutateAsync();
        setPrimaryAddress(response);
      } catch (error) {
        setPrimaryAddress(undefined);
        setShowApiErrorAlert(true);
      }
    };
    retrievePrimaryAddress();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH * (currentStep - 1) });

    if (mode === "address") Keyboard.dismiss();
    else handleOnInputPress();
  }, [mode]);

  const handleOnResetPincode = () => {
    setIsValid(true);
    setCurrentInput("");
    setSelectedPincode("");
    setRemainingTries(PIN_MAX_TRIES);
    setShowErrorBox(false);
  };

  const handleOnSetNewPin = () => {
    handleOnResetPincode();
    setMode("input");
  };

  const handleBack = () => {
    if (mode === "address") {
      handleOnResetPincode();
      setMode("input");

      return;
    }

    navigation.navigate("Temporary.LandingScreen");
  };

  const currentStep = mode === "input" ? 1 : mode === "confirm" ? 2 : 3;

  return (
    <Page>
      <NavHeader title={t("ApplyCards.SetPinAndAddressScreen.navTitle")} onBackPress={handleBack} end="close">
        <ProgressIndicator currentStep={currentStep} totalStep={3} />
      </NavHeader>
      <View style={styles.flex}>
        <View style={styles.flex}>
          <TextInput
            autoFocus
            ref={textInputRef}
            maxLength={PIN_INPUT_LENGTH}
            keyboardType="number-pad"
            blurOnSubmit={false}
            value={currentInput}
            style={styles.hiddenInput}
            onChangeText={handleOnChangeText}
          />
          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            keyboardShouldPersistTaps="always"
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            scrollEnabled={false}
            bounces={false}>
            <View style={styles.fullWidth}>
              <CreateCardPin
                title={t("ApplyCards.SetPinAndAddressScreen.SetPin.title")}
                instruction={t("ApplyCards.SetPinAndAddressScreen.SetPin.instruction")}
                inputValue={currentInput}
                isValid={isValid}
                mode={mode}
                remainingTries={0}
                pinInputLength={PIN_INPUT_LENGTH}
                pinMaxTries={PIN_MAX_TRIES}
                onBoxPress={handleOnInputPress}
              />
            </View>
            <View style={styles.fullWidth}>
              <CreateCardPin
                title={t("ApplyCards.SetPinAndAddressScreen.ConfirmPin.title")}
                instruction={t("ApplyCards.SetPinAndAddressScreen.ConfirmPin.instruction")}
                remainingTries={remainingTries}
                inputValue={currentInput}
                showErrorBox={showErrorBox}
                isValid={isValid}
                mode={mode}
                pinInputLength={PIN_INPUT_LENGTH}
                pinMaxTries={PIN_MAX_TRIES}
                onSetNewPin={handleOnSetNewPin}
                onBoxPress={handleOnInputPress}
              />
            </View>
            <View style={styles.fullWidth}>
              <CardDeliveryDetails primaryAddress={primaryAddress} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Page>
  );
}

const SCREEN_WIDTH = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  fullWidth: {
    width: SCREEN_WIDTH,
  },
  hiddenInput: {
    left: -200,
    opacity: 0,
    position: "absolute",
    top: -200,
  },
});
