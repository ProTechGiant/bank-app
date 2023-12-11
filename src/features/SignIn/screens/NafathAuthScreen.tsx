//TODO; make it a common component FOR ONBOARDING AND SIGN IN

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Platform, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import { LinkCard, LinkModal } from "@/components/LinkComponent";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Tag from "@/components/Tag";
import Typography from "@/components/Typography";
import { NAFATH_ANDROID_URL, NAFATH_APPLE_URL, NAFATH_DEEPLINK_ANDROID, NAFATH_DEEPLINK_IOS } from "@/constants";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";
import { getItemFromEncryptedStorage } from "@/utils/encrypted-storage";

import { useSignInContext } from "../contexts/SignInContext";
import { useGetCustomerDetails, usePanicMode, useRequestNumberPanic } from "../hooks/query-hooks";
import { UserType } from "../types";

interface ErrorType {
  errorContent: {
    Errors: Array<{
      ErrorId: string;
    }>;
  };
}

export default function NafathAuthScreen() {
  const { t } = useTranslation();
  const { mutateAsync } = useRequestNumberPanic();
  const { isPanicMode, setIsPanicMode } = useSignInContext();
  const { mutateAsync: editPanicMode } = usePanicMode();

  const { data: customerDetails, refetch: refetchCustomerDetails } = useGetCustomerDetails();

  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [requestedOtpNumber, setRequestedOtpNumber] = useState<number | undefined>();
  const [isIndicator, setIsIndicator] = useState<boolean>(false);
  const [unAuthenticatedErrorModal, setUnAuthenticatedErrorModal] = useState<boolean>(false);
  const [isWentWrong, setIsWentWrong] = useState<boolean>(false);
  const [isNafathUnsccessful, setIsNafathUnsccessful] = useState<boolean>(false);
  const [isReachLimit, setIsReachLimit] = useState<boolean>(false);

  const [user, setUser] = useState<UserType | undefined>();
  const [tempUser, setTempUser] = useState<UserType | undefined>();
  const [isConfirmPanicModal, setIsConfirmPanicModal] = useState<boolean>(false);

  const handleError = (error: ErrorType) => {
    if (error?.errorContent?.Errors[0]?.ErrorId) {
      const errorCode = error.errorContent.Errors[0]?.ErrorId;
      // 0016 is error reach limit
      if (errorCode === "0016") {
        setIsReachLimit(true);
      }
    } else {
      setIsWentWrong(true);
    }
  };

  const handleOnToggleModal = async () => {
    try {
      const isVisible = !isModalVisible;
      if (isVisible) {
        setIsIndicator(true);
        const response = await mutateAsync();
        setIsIndicator(false);
        const randomValue = response.body?.random;
        setRequestedOtpNumber(parseInt(randomValue, 10));
        setIsModalVisible(isVisible);
      }
    } catch (error: any) {
      delayTransition(() => handleError(error));
      setIsIndicator(false);
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const userData = await getItemFromEncryptedStorage("user");
      const tempUserData = await getItemFromEncryptedStorage("tempUser");
      setUser(JSON.parse(userData));
      setTempUser(JSON.parse(tempUserData));
    };
    getUser();
  }, []);

  useEffect(() => {
    try {
      if (requestedOtpNumber && customerDetails === undefined) {
        refetchCustomerDetails();
      }
    } catch (err) {
      setIsIndicator(false);
      warn("Fetch Customer Error", JSON.stringify(err));
      // TODO: ADD NAFATH unsuccessful error when we add real integration
      // setIsNafathUnsccessful(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnOpenNafathApp = async () => {
    const url = Platform.OS === "android" ? NAFATH_DEEPLINK_ANDROID : NAFATH_DEEPLINK_IOS;

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

  const handleNavigate = () => {
    //TODO: this block is added for testing purpose will update it after testing
    setIsIndicator(true);
    setTimeout(() => {
      setIsIndicator(false);
      if (isPanicMode) {
        setIsConfirmPanicModal(true);
      } else {
        navigation.navigate("SignIn.CreatePasscode");
      }
    }, 10000);
  };

  const handleOnActivePanicMode = async () => {
    setIsConfirmPanicModal(false);
    try {
      setIsIndicator(true);
      await editPanicMode({
        isPanic: true,
        nationalId: tempUser.NationalId || user.NationalId,
        mobileNumber: tempUser.MobileNumber || user.MobileNumber,
      });
      setIsIndicator(false);
      navigation.navigate("SignIn.SignInStack", {
        screen: "SignIn.Iqama",
      });
    } catch (error) {
      setUnAuthenticatedErrorModal(true);
      setIsIndicator(false);
    }
  };
  const container = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["24p"],
    flex: 1,
  }));

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
    marginTop: theme.spacing["16p"],
  }));

  const loadingContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    justifyContent: "center",
    marginVertical: theme.spacing["32p"],
  }));

  const numberContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    backgroundColor: theme.palette["primaryBase-30"],
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    marginTop: theme.spacing["32p"],
    marginBottom: theme.spacing["16p"],
    width: 60,
  }));

  const subTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    width: "80%",
  }));

  const tagContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    marginBottom: theme.spacing["8p"],
  }));
  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={true}
        title={t("NafathAuthScreen.navHeaderTitle")}
        testID="SignIn.NafathAuthScreen:NavHeader"
      />
      {isIndicator ? (
        <View style={styles.loading}>
          <FullScreenLoader />
        </View>
      ) : (
        <View style={container}>
          <LinkModal
            modalVisible={isModalVisible}
            linkText={t("NafathAuthScreen.modalLink")}
            onNavigate={handleOnOpenNafathApp}
            toggleModal={handleOnToggleModal}>
            <Stack align="center" direction="vertical" justify="center">
              {requestedOtpNumber !== undefined ? (
                <View style={numberContainerStyle}>
                  <Typography.Text color="neutralBase-50" weight="bold" size="title1" align="center">
                    {requestedOtpNumber}
                  </Typography.Text>
                </View>
              ) : (
                <View style={loadingContainerStyle}>
                  <Typography.Text color="neutralBase" weight="bold" size="title1" align="center">
                    {t("NafathAuthScreen.modalLoad")}
                  </Typography.Text>
                </View>
              )}
              <Typography.Text color="neutralBase" size="callout" align="center">
                {t("NafathAuthScreen.modalBody")}
              </Typography.Text>
            </Stack>
          </LinkModal>
          <View style={headerContainerStyle}>
            <Typography.Text size="title1" weight="bold">
              {t("NafathAuthScreen.title")}
            </Typography.Text>
            <Typography.Text size="callout" weight="regular">
              {t("NafathAuthScreen.subTitle")}
            </Typography.Text>
          </View>
          <Stack align="stretch" direction="vertical" gap="20p">
            <LinkCard onNavigate={handleOnToggleModal} testID="SignIn.NafathAuthScreen:SelectNafathAppButton">
              <View style={tagContainerStyle}>
                <Tag title="Nafath app" variant="pink" />
              </View>
              <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                {t("NafathAuthScreen.appButtonTitle")}
                <Typography.Text weight="regular" size="footnote">
                  {t("NafathAuthScreen.appButtonSubtitle")}
                </Typography.Text>
              </Typography.Text>
              <Typography.Text size="footnote" color="neutralBase" style={subTextStyle}>
                {t("NafathAuthScreen.appButtonBody")}
              </Typography.Text>
            </LinkCard>
            <Accordion title={t("NafathAuthScreen.dropdownTitle")}>
              <Typography.Text color="neutralBase+10" size="footnote">
                {t("NafathAuthScreen.dropdownBody")}
              </Typography.Text>
            </Accordion>
          </Stack>
        </View>
      )}
      <NotificationModal
        testID="SignIn.PanicModeScreen:ErrorModal"
        variant="error"
        title={t("SignIn.Modal.error.panic.title")}
        message={t("SignIn.Modal.error.panic.subTitle")}
        isVisible={unAuthenticatedErrorModal}
        onClose={() => setUnAuthenticatedErrorModal(false)}
      />
      <NotificationModal
        testID="SignIn.PanicModeScreen:ErrorModal"
        variant="error"
        title={t("SignIn.Modal.error.panic.unSccsessNafathTitle")}
        message={t("SignIn.Modal.error.panic.unSccsessNafathSubTitle")}
        isVisible={isNafathUnsccessful}
        onClose={() => setIsNafathUnsccessful(false)}
      />
      <NotificationModal
        testID="SignIn.PanicModeScreen:ErrorModal"
        variant="error"
        title={t("SignIn.Modal.error.title")}
        message={t("SignIn.Modal.error.subTitle")}
        isVisible={isWentWrong}
        onClose={() => setIsWentWrong(false)}
      />
      <NotificationModal
        testID="SignIn.PanicModeScreen:ErrorModal"
        variant="error"
        title={t("SignIn.Modal.error.title")}
        message={t("SignIn.Modal.error.panic.reachLimitSubTitle")}
        isVisible={isReachLimit}
        onClose={() => setIsReachLimit(false)}
      />
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
                if (user && tempUser) {
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
  loading: {
    flex: 1,
    marginTop: -49,
  },
});
