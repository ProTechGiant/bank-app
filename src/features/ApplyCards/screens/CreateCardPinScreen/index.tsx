import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Keyboard, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ErrorBlackIcon, InfoIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useOrderCardContext } from "../../context/OrderCardContext";
import encryptPincode from "./encrypt-pincode";
import isValidPincode from "./is-valid-pincode";
import PinCodeInput from "./PinCodeInput";

const SCREEN_HEIGHT = Dimensions.get("screen").height;
const PIN_INPUT_LENGTH = 4;
const PIN_MAX_TRIES = 3;

export default function CreateCardPinScreen() {
  const buttonStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["errorBase-20"],
      borderRadius: theme.radii.xlarge,
      justifyContent: "center",
      minHeight: 40,
      minWidth: 100,
      padding: theme.spacing.small,
    }),
    []
  );
  const errorContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["errorBase-40"],
      flexDirection: "row",
      justifyContent: "space-between",
      padding: theme.spacing.large,
    }),
    []
  );
  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      marginBottom: theme.spacing.medium,
    }),
    []
  );
  const infoContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["tintBase-30"],
      borderRadius: theme.radii.extraSmall,
      flexDirection: "row",
      justifyContent: "space-between",
      padding: theme.spacing.large,
    }),
    []
  );
  const infoContainerInvalidStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["errorBase-40"],
    }),
    []
  );
  const infoTextStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing.medium,
    }),
    []
  );

  const pincodeInputRef = useRef<React.ElementRef<typeof PinCodeInput>>(null);
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();
  const navigation = useNavigation();

  const [currentInput, setCurrentInput] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
  const [showErrorBox, setShowErrorBox] = useState(false);
  const [remainingTries, setRemainingTries] = useState(PIN_MAX_TRIES);
  const [mode, setMode] = useState<"input" | "confirm">("input");

  useEffect(() => {
    if (PIN_INPUT_LENGTH === currentInput.length) {
      if (mode === "input") {
        if (!isValidPincode(currentInput)) {
          return Alert.alert("Easy PIN", "Avoid a PIN with simple number sequences and repated numbers", [
            { text: "Change it", onPress: () => handleOnResetPincode(), style: "default" },
          ]);
        }

        setMode("confirm");
        setSelectedPincode(currentInput);
        setCurrentInput("");
      }

      if (mode === "confirm") {
        if (currentInput !== selectedPincode) {
          setRemainingTries(remainingTries - 1);
          setShowErrorBox(true);

          if (remainingTries - 1 > 0) setCurrentInput("");
        }

        if (currentInput === selectedPincode) {
          setSelectedPincode(currentInput);

          setOrderCardValues({
            ...orderCardValues,
            formValues: { ...orderCardValues.formValues, pin: encryptPincode(currentInput) },
          });

          setImmediate(() => handleOnResetPincode());
          navigation.navigate("ApplyCards.CardDeliveryDetails");
        }
      }
    }
  }, [currentInput]);

  useEffect(() => {
    const unsubscribe = Keyboard.addListener("keyboardDidHide", () => {
      pincodeInputRef.current?.blur();
    });

    return () => unsubscribe.remove();
  }, []);

  const handleOnResetPincode = () => {
    setCurrentInput("");
    setSelectedPincode("");
    setRemainingTries(PIN_MAX_TRIES);
    setShowErrorBox(false);
    setMode("input");
  };

  return (
    <Page>
      <NavHeader
        title="Order card"
        backButton={true}
        backButtonHandler={mode !== "input" ? handleOnResetPincode : undefined}>
        <ProgressIndicator currentStep={mode === "input" ? 1 : 2} totalStep={3} />
      </NavHeader>
      <ContentContainer>
        <View style={headerStyle}>
          <Typography.Text size="large" weight="bold">
            {mode === "input" ? "Set PIN" : "Confirm PIN"}
          </Typography.Text>
        </View>
        <View style={styles.text}>
          <Typography.Text size="callout">
            {mode === "input"
              ? `Enter ${PIN_INPUT_LENGTH} unique numbers`
              : `Re-enter your ${PIN_INPUT_LENGTH} numbers`}
          </Typography.Text>
        </View>
        <View style={{ height: SCREEN_HEIGHT / 4 }}>
          <PinCodeInput
            inputLength={PIN_INPUT_LENGTH}
            value={currentInput}
            onChangeText={value => {
              if (remainingTries === 0) handleOnResetPincode();
              setCurrentInput(value);
            }}
            ref={pincodeInputRef}
            isValid={remainingTries !== 0}
          />
        </View>
        {mode === "input" && (
          <View style={infoContainerStyle}>
            <InfoIcon />
            <View style={infoTextStyle}>
              <Typography.Text size="callout">Avoid a PIN that’s easy to guess, like 1234 or 1111.</Typography.Text>
            </View>
          </View>
        )}
        {mode === "confirm" && remainingTries < PIN_MAX_TRIES && showErrorBox && (
          <>
            {remainingTries > 0 ? (
              <View style={[infoContainerStyle, infoContainerInvalidStyle]}>
                <ErrorBlackIcon />
                <View style={infoTextStyle}>
                  <Typography.Text size="callout">
                    Your PINs didn’t match, please try again. {remainingTries}{" "}
                    <Typography.Text>{remainingTries !== 1 ? "tries" : "try"}</Typography.Text> remaining.
                  </Typography.Text>
                </View>
              </View>
            ) : (
              <View style={errorContainerStyle}>
                <ErrorBlackIcon />
                <View>
                  <Typography.Text size="callout">Oops! Too many tries</Typography.Text>
                </View>
                <View style={buttonStyle}>
                  <Pressable onPress={handleOnResetPincode}>
                    <Typography.Text size="footnote" weight="medium">
                      Set New PIN
                    </Typography.Text>
                  </Pressable>
                </View>
              </View>
            )}
          </>
        )}
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  text: {
    alignItems: "center",
  },
});
