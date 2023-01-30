import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Dimensions, Keyboard, ScrollView, StyleSheet, TextInput, View } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import useNavigation from "@/navigation/use-navigation";

import { useOrderCardContext } from "../../context/OrderCardContext";
import CardDeliveryDetails from "./CardDeliveryDetails";
import CreateCardPin from "./CreateCardPin";
import isValidPincode from "./CreateCardPin/is-valid-pincode";
import encryptPincode from "./encrypt-pincode";

const PIN_INPUT_LENGTH = 4;
const PIN_MAX_TRIES = 3;

export default function SetPinAndAddressScreen() {
  const { t } = useTranslation();
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();
  const navigation = useNavigation();

  const textInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const [currentInput, setCurrentInput] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [mode, setMode] = useState<"input" | "confirm">("input");
  const [remainingTries, setRemainingTries] = useState(PIN_MAX_TRIES);
  const [selectedPincode, setSelectedPincode] = useState("");
  const [showErrorBox, setShowErrorBox] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const boxPressHandler = () => {
    textInputRef.current?.focus();
  };

  useEffect(() => {
    if (PIN_INPUT_LENGTH !== currentInput.length) {
      return;
    }

    if (mode === "input") {
      if (!isValidPincode(currentInput)) {
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
      setSelectedPincode(currentInput);
      setCurrentInput("");
      setCurrentStep(2);
      setMode("confirm");
    }

    if (mode === "confirm") {
      if (currentInput !== selectedPincode) {
        setRemainingTries(remainingTries - 1);
        setShowErrorBox(true);
        setIsValid(false);

        if (remainingTries - 1 > 0) setCurrentInput("");
      }

      if (currentInput === selectedPincode) {
        setSelectedPincode(currentInput);
        setIsValid(true);
        setOrderCardValues({
          ...orderCardValues,
          formValues: { ...orderCardValues.formValues, pin: encryptPincode(currentInput) },
        });

        setImmediate(() => handleOnResetPincode());
        setCurrentStep(3);
      }
    }
  }, [currentInput]);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH * (currentStep - 1) });

    if (currentStep === 3) {
      Keyboard.dismiss();
    } else {
      textInputRef.current?.focus();
    }
  }, [currentStep]);

  const handleOnResetPincode = () => {
    setIsValid(true);
    setCurrentInput("");
    setSelectedPincode("");
    setRemainingTries(PIN_MAX_TRIES);
    setShowErrorBox(false);
    setMode("input");
  };

  const handleBack = () => {
    if (currentStep === 2 || currentStep === 3) {
      handleOnResetPincode();
      setCurrentStep(1);
    } else {
      navigation.navigate("Temporary.LandingScreen");
    }
  };

  const handleOnSetNewPin = () => {
    handleOnResetPincode();
    setCurrentStep(1);
  };

  const onChangeText = (value: string) => {
    setCurrentInput(value);
  };

  return (
    <Page>
      <NavHeader
        title={t("ApplyCards.SetPinAndAddressScreen.navTitle")}

        onBackPress={handleBack}
        right="close">
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
            onChangeText={onChangeText}
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
                inputValue={currentInput}
                isValid={isValid}
                mode={mode}
                remainingTries={0}
                pinInputLength={PIN_INPUT_LENGTH}
                pinMaxTries={PIN_MAX_TRIES}
                onBoxPress={boxPressHandler}
              />
            </View>
            <View style={styles.fullWidth}>
              <CreateCardPin
                title={t("ApplyCards.SetPinAndAddressScreen.ConfirmPin.title")}
                remainingTries={remainingTries}
                inputValue={currentInput}
                showErrorBox={showErrorBox}
                isValid={isValid}
                mode={mode}
                pinInputLength={PIN_INPUT_LENGTH}
                pinMaxTries={PIN_MAX_TRIES}
                onSetNewPin={handleOnSetNewPin}
                onBoxPress={boxPressHandler}
              />
            </View>
            <View style={styles.fullWidth}>
              <CardDeliveryDetails />
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
