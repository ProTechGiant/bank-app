import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ProgressIndicator } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import useNavigation from "@/navigation/use-navigation";

export default function CreatePINScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [passCode, setPassCode] = useState<string>("");
  const PASSCODE_LENGTH = 4;

  useEffect(() => {
    if (!isFocused) {
      setPassCode("");
    }
  }, [isFocused]);

  const handleOnChangeText = (enteredPassCode: string) => {
    setPassCode(enteredPassCode);
    if (enteredPassCode.length === PASSCODE_LENGTH) {
      navigation.navigate("AllInOneCard.ConfirmPINScreen", { passCode: enteredPassCode });
    }
  };

  return (
    <Page>
      <NavHeader
        title={
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={1} totalStep={2} />
          </View>
        }
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />
      <ContentContainer>
        <View style={styles.containerStyle}>
          <PasscodeInput
            title={t("AllInOneCard.CreatePINScreen.title")}
            subTitle={t("AllInOneCard.CreatePINScreen.description")}
            length={PASSCODE_LENGTH}
            passcode={passCode}
          />
          <NumberPad passcode={passCode} setPasscode={handleOnChangeText} />
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  progressIndicator: { width: "80%" },
});
