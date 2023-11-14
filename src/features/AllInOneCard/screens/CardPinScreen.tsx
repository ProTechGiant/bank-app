import { StackActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PINCODE_LENGTH } from "../constants";
import { passcode } from "../mocks";

export default function CardPinScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [showModel, setShowModel] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>("");

  useEffect(() => {
    handleOnChange();
  }, [pinCode]);

  const handleOnChange = () => {
    if (pinCode.length === PINCODE_LENGTH) {
      handleSubmit();
      setPinCode("");
    }
  };

  const handleSubmit = async () => {
    // Todo remove this code when api is ready
    if (pinCode === passcode) {
      navigation.navigate("AllInOneCard.CardControlScreen", {
        pinVerified: true,
      });
    } else {
      setShowModel(true);
    }
  };

  const handleBlockedNavigate = async () => {
    setShowModel(false);
  };

  const handleCloseButton = () => {
    navigation.dispatch(StackActions.pop(2));
    navigation.navigate("Home.HomeTabs", { screen: "Cards" });
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: "100%",
    marginTop: theme.spacing["24p"],
    padding: theme.spacing["24p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={true} />
      <View style={containerStyle}>
        <PasscodeInput
          title={t("AllInOneCard.CardPinScreen.title")}
          subTitle={t("AllInOneCard.CardPinScreen.subTitle")}
          length={4}
          passcode={pinCode}
        />
        <NumberPad passcode={pinCode} setPasscode={setPinCode} />
        <NotificationModal
          message={t("AllInOneCard.CardPinScreen.errorMessage")}
          title={t("AllInOneCard.CardPinScreen.errorTitle")}
          isVisible={showModel}
          buttons={{
            primary: <Button onPress={handleBlockedNavigate}>{t("AllInOneCard.CardPinScreen.primaryButton")}</Button>,
            secondary: <Button onPress={handleCloseButton}>{t("AllInOneCard.CardPinScreen.closeButton")}</Button>,
          }}
          variant="error"
        />
      </View>
    </Page>
  );
}
