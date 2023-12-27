import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Platform, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { NAFATH_ANDROID_URL, NAFATH_APPLE_URL, NAFATH_DEEPLINK_ANDROID, NAFATH_DEEPLINK_IOS } from "@/constants";
import { useAuthContext } from "@/contexts/AuthContext";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { getItemFromEncryptedStorage } from "@/utils/encrypted-storage";

import { useSignInContext } from "../contexts/SignInContext";
import { usePanicMode } from "../hooks/query-hooks";
import { UserType } from "../types";

export default function NafathCodeScreen() {
  const { t } = useTranslation();
  const { isPanicMode, setIsPanicMode } = useSignInContext();
  const { mutateAsync: editPanicMode } = usePanicMode();
  const auth = useAuthContext();
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const route = useRoute<RouteProp<UnAuthenticatedStackParams, "SignIn.NafathCode">>();
  const [isConfirmPanicModal, setIsConfirmPanicModal] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | undefined>();

  const nafathCode = route.params?.nafathCode;

  useEffect(() => {
    const getUser = async () => {
      const userData = await getItemFromEncryptedStorage("user");
      if (userData) setUser(JSON.parse(userData));
    };
    getUser();
  }, []);

  const handleOnActivePanicMode = async () => {
    setIsConfirmPanicModal(false);
    try {
      if (!user) return;
      await editPanicMode({
        isPanic: true,
        nationalId: user.NationalId,
        mobileNumber: user.MobileNumber,
        token: auth.authToken,
      });

      setIsConfirmPanicModal(false);
      navigation.navigate("SignIn.SignInStack", {
        screen: "SignIn.Iqama",
      });
    } catch (error) {
      setIsButtonPressed(false);
    }
  };

  const handleOpenNafathApp = async (url: string) => {
    try {
      if ((await Linking.canOpenURL(url)) === false) {
        Alert.alert(t("NafathAuthScreen.alertModelTitle"), t("NafathAuthScreen.alertModelMessage"), [
          {
            text: t("NafathAuthScreen.alertModelCancelButton"),
            style: "cancel",
          },
          {
            text:
              Platform.OS === "android"
                ? t("NafathAuthScreen.alertModelPlayStoreButton")
                : t("NafathAuthScreen.alertModelAppStoreButton"),
            onPress: async () => {
              const storeURL = Platform.OS === "android" ? NAFATH_ANDROID_URL : NAFATH_APPLE_URL;

              /* await */ Linking.openURL(storeURL);
              handleNavigate();
            },
          },
        ]);

        return;
      }

      await Linking.openURL(url);
      handleNavigate();
    } catch (error) {
      warn("nafath", "Could not open Nafath app: ", JSON.stringify(error));
    }
  };

  const handleOnOpenNafathApp = () => {
    const url = Platform.OS === "android" ? NAFATH_DEEPLINK_ANDROID : NAFATH_DEEPLINK_IOS;
    handleOpenNafathApp(url);
  };

  const handleNavigate = () => {
    setIsButtonPressed(true);
    setTimeout(() => {
      if (isPanicMode) {
        setIsConfirmPanicModal(true);
        setIsButtonPressed(false);
      } else {
        navigation.navigate("SignIn.CreatePasscode");
        setIsButtonPressed(false);
      }
    }, 10000);
  };

  const numberContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    backgroundColor: theme.palette.complimentBase,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60,
  }));

  const infoContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={false}
        title={t("NafathCodeScreen.title")}
        testID="Onboarding.NafathAuthScreen:NavHeader"
      />
      {isButtonPressed ? (
        <View style={styles.loading}>
          <FullScreenLoader />
        </View>
      ) : (
        <Stack justify="center" align="center" direction="vertical" flex={1} gap="32p">
          <View style={numberContainerStyle}>
            <Typography.Text color="neutralBase-50" weight="bold" size="title1" align="center">
              {nafathCode}
            </Typography.Text>
          </View>
          <Stack direction="vertical" gap="16p" align="center" style={infoContainerStyle}>
            <Typography.Text color="neutralBase+30" weight="medium" size="title2" align="center">
              {t("NafathCodeScreen.title")}
            </Typography.Text>
            <Typography.Text color="neutralBase+10" weight="regular" size="callout" align="center">
              {t("NafathCodeScreen.description")}
            </Typography.Text>
          </Stack>
          <View style={styles.buttonContainerStyle}>
            <Button onPress={handleOnOpenNafathApp}>{t("NafathCodeScreen.buttonTitle")}</Button>
          </View>
        </Stack>
      )}
      <NotificationModal
        testID="SignIn.PasscodeScreen:PanicModal"
        variant="warning"
        title={t("SignIn.PanicModeScreen.modal.activeTitle")}
        message={t("SignIn.PanicModeScreen.modal.activeMessage")}
        isVisible={isConfirmPanicModal}
        buttons={{
          primary: (
            <Button testID="SignIn.PasscodeScreen:ProccedButton" onPress={handleOnActivePanicMode}>
              {t("SignIn.PanicModeScreen.buttons.confirm")}
            </Button>
          ),
          secondary: (
            <Button
              testID="SignIn.PasscodeScreen:CancelButton"
              onPress={() => {
                setIsPanicMode(false);
                if (user) {
                  navigation.navigate("SignIn.SignInStack", {
                    screen: "SignIn.Passcode",
                  });
                  setIsConfirmPanicModal(false);
                } else {
                  navigation.navigate("SignIn.SignInStack", {
                    screen: "SignIn.Iqama",
                  });
                }
              }}>
              {t("SignIn.PasscodeScreen.signInModal.cancelButton")}
            </Button>
          ),
        }}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  buttonContainerStyle: {
    bottom: 25,
    position: "absolute",
    width: "90%",
  },
  loading: {
    flex: 1,
    marginTop: -49,
  },
});
