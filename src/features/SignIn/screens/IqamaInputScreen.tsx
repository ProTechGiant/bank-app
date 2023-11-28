import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { OTP_BLOCKED_TIME } from "@/constants";
import { useAuthContext } from "@/contexts/AuthContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import useBlockedUserFlow from "@/hooks/use-blocked-user-handler";
import { useSearchUserByNationalId } from "@/hooks/use-search-user-by-national-id";
import useCheckTPPService from "@/hooks/use-tpp-service";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";
import delayTransition from "@/utils/delay-transition";
import { getItemFromEncryptedStorage, setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import { PanicIcon } from "../assets/icons";
import { MobileAndNationalIdForm } from "../components";
import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import { useCheckCustomerStatus, useSendLoginOTP } from "../hooks/query-hooks";
import { IqamaInputs, StatusTypes, UserType } from "../types";

export default function IqamaInputScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const otpFlow = useOtpFlow();
  const useSendLoginOtpAsync = useSendLoginOTP();
  const blockedUserFlow = useBlockedUserFlow();

  const { mutateAsync, error, reset } = useSearchUserByNationalId();
  const { mutateAsync: checkCustomerStatus } = useCheckCustomerStatus();
  const iqamaError = error as ApiError;
  const { errorMessages } = useErrorMessages(iqamaError);
  const { setSignInCorrelationId } = useSignInContext();
  const [notMatchRecord, setNotMatchRecord] = useState(false);
  const [isDeceased, setIsDeceased] = useState(false);
  const [isPanicModalVisible, setIsPanicModalVisible] = useState(false);
  const [submittedMobileNumber, setSubmittedMobileNumber] = useState("");
  const [user, setUser] = useState<UserType | null>(null);
  const [inPanicMode, setInPanicMode] = useState(false);

  const checkUserAccountStatus = async () => {
    try {
      if (user) {
        const response = await checkCustomerStatus(user.CustomerId);

        if (response) {
          if (response.StatusId === StatusTypes.PANIC_MODE) {
            setInPanicMode(true);
          }
        }
      }
    } catch (err) {
      warn("checkUserStatus", "Could check user status. Error: ", JSON.stringify(err));
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const userData = await getItemFromEncryptedStorage("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        const tempUserData = await getItemFromEncryptedStorage("tempUser");
        setUser(tempUserData ? JSON.parse(tempUserData) : null);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const _correlationId = generateRandomId();
    setSignInCorrelationId(_correlationId);
  }, []);

  useEffect(() => {
    if (
      iqamaError &&
      iqamaError.errorContent &&
      iqamaError.errorContent.Errors &&
      iqamaError.errorContent.Errors.some(({ ErrorId }: { ErrorId: string }) => ErrorId === "0061")
    ) {
      reset();
    }
  }, [iqamaError, reset]);

  const auth = useAuthContext();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();

  const handleGetAuthenticationToken = async () => {
    const res = await getAuthenticationToken();
    if (typeof res?.AccessToken === "string") {
      setItemInEncryptedStorage("authToken", res.AccessToken);
      auth.setAuthToken(res.AccessToken);
    }
  };

  const comingFromTPP = useCheckTPPService();

  useEffect(() => {
    if (comingFromTPP) {
      handleGetAuthenticationToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, comingFromTPP]);

  const handleOnSignUp = () => {
    navigation.navigate("Onboarding.Iqama");
  };

  const storeUserToLocalStorage = (user: UserType) => {
    setItemInEncryptedStorage("tempUser", JSON.stringify(user));
  };

  const [isDeactivePaincModeVisible, setIsDeactivePaincModeVisible] = useState(false);

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      const { NationalId, MobileNumber } = values;
      const response = await mutateAsync({ NationalId, MobileNumber });
      setSubmittedMobileNumber(MobileNumber);
      if (!response.AccountValid) {
        setIsDeceased(true);
      } else if (response.TotalRecords === 1) {
        await checkUserAccountStatus();

        setNotMatchRecord(false);
        storeUserToLocalStorage(response);
        if (inPanicMode) {
          setIsDeactivePaincModeVisible(true);
        } else {
          navigation.navigate("SignIn.Passcode");
        }
      } else if (response.TotalRecords === 0) {
        setNotMatchRecord(true);
      }
    } catch (err) {
      setNotMatchRecord(false);
      warn("signIn", "Could not process iqama input. Error: ", JSON.stringify(err));
    }
  };

  const handleOTP = (mobileNumber: string) => {
    otpFlow.handle({
      action: {
        to: "SignIn.Iqama",
      },
      otpChallengeParams: {
        mobileNumber,
      },
      onOtpRequest: async () => {
        return useSendLoginOtpAsync.mutateAsync("reset-passcode");
      },
      // TODO here maybe will add new otp reason
      otpVerifyMethod: "reset-passcode",
      onFinish: (status: string) => {
        if (status === "success") {
          navigation.navigate("SignIn.CardPin");
        }
      },
      onUserBlocked: () => {
        blockedUserFlow.handle("otp", OTP_BLOCKED_TIME);
      },
    });
  };

  const handleOnCloseUnauthorizedModal = () => {
    setIsDeceased(false);
  };

  const handleOnNavigateToPancMode = () => {
    navigation.navigate("SignIn.PanicModeScreen");
    setIsPanicModalVisible(false);
  };

  const accountSignInStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    flexDirection: "row",
    marginVertical: theme.spacing["20p"],
  }));

  const panicIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Page backgroundColor="neutralBase-60">
      <KeyboardAvoidingView behavior="height" style={styles.component}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.contentContainer}>
          <NavHeader
            testID="SignIn.Iqama:NavHeader"
            withBackButton={!comingFromTPP}
            end={
              <Pressable onPress={() => setIsPanicModalVisible(true)}>
                <PanicIcon color={panicIconColor} width={34} height={34} />
              </Pressable>
            }
          />
          <MobileAndNationalIdForm
            onSubmit={handleOnSubmit}
            errorMessages={errorMessages}
            onSignInPress={handleOnSignUp}
            notMatchRecord={notMatchRecord}
            title={t("SignIn.IqamaInputScreen.title")}
            subTitle={t("SignIn.IqamaInputScreen.subTitle")}
            buttonText={t("SignIn.IqamaInputScreen.continue")}
          />
          {!comingFromTPP ? (
            <View style={accountSignInStyle}>
              <Typography.Text size="footnote" weight="regular">
                {t("SignIn.IqamaInputScreen.subtext")}
              </Typography.Text>
              <Pressable onPress={handleOnSignUp}>
                <Typography.Text style={styles.signIn} size="footnote" weight="medium" color="primaryBase-30">
                  {t("SignIn.IqamaInputScreen.signUp")}
                </Typography.Text>
              </Pressable>
            </View>
          ) : (
            <View style={accountSignInStyle} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <NotificationModal
        variant="error"
        title={t("SignIn.Modal.title")}
        message={t("SignIn.Modal.subTitle")}
        isVisible={isDeceased}
        onClose={handleOnCloseUnauthorizedModal}
      />
      <NotificationModal
        testID="SignIn.IqamaInputScreen:PanicModal"
        variant="warning"
        title={t("SignIn.PanicModeScreen.modal.activeTitle")}
        message={t("SignIn.PanicModeScreen.modal.customerMessage")}
        isVisible={isPanicModalVisible}
        onClose={() => setIsPanicModalVisible(false)}
        buttons={{
          primary: (
            <Button testID="SignIn.IqamaInputScreen:ProceedButton" onPress={handleOnNavigateToPancMode}>
              {t("SignIn.IqamaInputScreen.proceed")}
            </Button>
          ),
          secondary: (
            <Button testID="SignIn.IqamaInputScreen:CancelButton" onPress={() => setIsPanicModalVisible(false)}>
              {t("SignIn.IqamaInputScreen.cancel")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        testID="SignIn.Iqama:DeactiveModal"
        variant="warning"
        title={t("SignIn.PanicModeScreen.modal.deactiveTitle")}
        message={t("SignIn.PanicModeScreen.modal.deactiveMessage")}
        isVisible={isDeactivePaincModeVisible}
        onClose={() => setIsDeactivePaincModeVisible(false)}
        buttons={{
          primary: (
            <Button
              testID="SignIn.PanicModeScreen:ProceedButton"
              onPress={() => {
                setIsDeactivePaincModeVisible(false);
                delayTransition(() => {
                  handleOTP(submittedMobileNumber);
                });
              }}>
              {t("SignIn.IqamaInputScreen.proceed")}
            </Button>
          ),
          secondary: (
            <Button testID="SignIn.PanicModeScreen:CancelButton" onPress={() => setIsDeactivePaincModeVisible(false)}>
              {t("SignIn.IqamaInputScreen.cancel")}
            </Button>
          ),
        }}
      />
    </Page>
  );
}
const styles = StyleSheet.create({
  component: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  signIn: {
    textDecorationLine: "underline",
  },
});
