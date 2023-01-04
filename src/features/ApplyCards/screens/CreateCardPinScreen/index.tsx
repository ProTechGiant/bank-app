import * as React from "react";
import { Dimensions, Keyboard, Pressable, SafeAreaView, StyleSheet, View } from "react-native";

import { ErrorBlackIcon, InfoIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { palette, radii, spacing } from "@/theme/values";

import { useOrderCardContext } from "../../context/OrderCardContext";
import PinCodeInput from "./PinCodeInput";

const height = Dimensions.get("screen").height;

const inputLength = 4;
const maxTries = 3;

const inputHeader = "Set PIN";
const inputText = `Enter ${inputLength} unique numbers`;
const confirmHeader = "Confirm PIN";
const confirmText = `Re-enter your ${inputLength} numbers`;

export default function CreateCardPinScreen() {
  const pincodeInputRef = React.useRef<React.ElementRef<typeof PinCodeInput>>(null);
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();
  const navigation = useNavigation();

  const [inputValue, setInputValue] = React.useState<string>("");
  const [pincode, setPincode] = React.useState<string>("");
  const [isValid, setIsValid] = React.useState<boolean>(true);
  const [remainingTries, setRemainingTries] = React.useState<number>(maxTries);

  const mode = orderCardValues.createCardPinMode;

  React.useEffect(() => {
    if (mode === "input") {
      setInputValue("");
    }
  }, [mode]);

  React.useEffect(() => {
    if (inputLength !== inputValue.length) {
      setIsValid(true);
    }
    if (inputLength === inputValue.length) {
      if (mode === "input") {
        setTimeout(() => {
          setOrderCardValues !== null &&
            setOrderCardValues({
              ...orderCardValues,
              createCardPinMode: "confirm",
            });
          setPincode(inputValue);
          setInputValue("");
        }, 150);
      }
      if (mode === "confirm") {
        if (inputValue !== pincode) {
          setIsValid(false);
          setRemainingTries(remainingTries - 1);
        }
        if (remainingTries === 0) {
          return;
        }
        if (inputValue === pincode) {
          setPincode(inputValue);

          // @TODO: encryption
          const encryptedPin = "61D4416E90747D56ACE5FCDDEFC2FDB7";
          setOrderCardValues !== null &&
            setOrderCardValues({
              ...orderCardValues,
              formValues: { ...orderCardValues.formValues, pin: encryptedPin },
              createCardPinMode: "input",
            });
          navigation.navigate("Cards.CardDeliveryDetails");
        }
      }
    }
  }, [inputValue]);

  React.useEffect(() => {
    const unsubscribe = Keyboard.addListener("keyboardDidHide", () => {
      pincodeInputRef.current?.blur();
    });
    return () => {
      unsubscribe.remove();
    };
  });

  const inputHandler = (value: string) => {
    setInputValue(value);
  };

  const handleOnBack = () => {
    setInputValue("");
    setOrderCardValues !== null &&
      setOrderCardValues({
        ...orderCardValues,
        createCardPinMode: "input",
      });
    setRemainingTries(maxTries);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {mode === "input" ? (
        <NavHeader title="Order card" backButton={true} />
      ) : (
        <NavHeader title="Order card" backButton={true} backButtonHandler={handleOnBack} />
      )}
      <View style={styles.container}>
        <View style={styles.progressIndicator}>
          <ProgressIndicator currentStep={mode === "input" ? 1 : 2} totalStep={3} />
        </View>
        <View style={styles.header}>
          <Typography.Text size="large" weight="bold">
            {mode === "input" ? inputHeader : confirmHeader}
          </Typography.Text>
        </View>
        <View style={styles.text}>
          <Typography.Text size="callout">{mode === "input" ? inputText : confirmText}</Typography.Text>
        </View>
        <View style={{ height: height / 4 }}>
          <PinCodeInput
            inputLength={inputLength}
            value={inputValue}
            onChangeText={inputHandler}
            ref={pincodeInputRef}
            isValid={isValid}
          />
        </View>
        {mode === "input" && (
          <View style={styles.infoContainer}>
            <InfoIcon />
            <View style={styles.infoText}>
              <Typography.Text size="callout">Avoid a PIN that’s easy to guess, like 1234 or 1111.</Typography.Text>
            </View>
          </View>
        )}
        {!isValid && remainingTries >= 1 && (
          <View style={[styles.infoContainer, { backgroundColor: palette["errorBase-40"] }]}>
            <ErrorBlackIcon />
            <View style={styles.infoText}>
              <Typography.Text size="callout">
                Your PINs didn’t match, please try again. {remainingTries}{" "}
                <Typography.Text>{remainingTries !== 1 ? "tries" : "try"}</Typography.Text> remaining.
              </Typography.Text>
            </View>
          </View>
        )}
        {remainingTries <= 0 && (
          <View style={styles.errorContainer}>
            <ErrorBlackIcon />
            <View>
              <Typography.Text size="callout">Oops! Too many tries</Typography.Text>
            </View>
            <View style={styles.button}>
              <Pressable onPress={handleOnBack}>
                <Typography.Text size="footnote" weight="medium">
                  Set New PIN
                </Typography.Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: palette["errorBase-20"],
    borderRadius: radii.xlarge,
    justifyContent: "center",
    minHeight: 40,
    minWidth: 100,
    padding: spacing.small,
  },
  container: {
    padding: spacing.medium,
  },
  errorContainer: {
    alignItems: "center",
    backgroundColor: palette["errorBase-40"],
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.large,
  },
  header: {
    alignItems: "center",
    paddingBottom: spacing.medium,
  },
  infoContainer: {
    alignItems: "center",
    backgroundColor: palette["tintBase-30"],
    borderRadius: radii.extraSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.large,
  },
  infoText: {
    paddingHorizontal: spacing.medium,
  },
  progressIndicator: {
    marginBottom: 44,
    marginTop: 12,
  },
  text: {
    alignItems: "center",
  },
});
