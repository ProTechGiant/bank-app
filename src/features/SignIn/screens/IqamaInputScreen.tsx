import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import { useSearchUserByNationalId } from "@/hooks/use-search-user-by-national-id";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";
import { getItemFromEncryptedStorage, setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import { MobileAndNationalIdForm } from "../components";
import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import { IqamaInputs, UserType } from "../types";

export default function IqamaInputScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutateAsync, error, reset } = useSearchUserByNationalId();
  const iqamaError = error as ApiError;
  const { errorMessages } = useErrorMessages(iqamaError);
  const { setSignInCorrelationId } = useSignInContext();
  const [notMatchRecord, setNotMatchRecord] = useState(false);
  const [comingFromTPP, setComingFromTPP] = useState<string | null>(null);

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
      auth.authenticateAnonymously(auth.userId as string, res.AccessToken);
    }
  };

  useEffect(() => {
    async function checkTPPService() {
      const comingFromTPP = await getItemFromEncryptedStorage("COMING_FROM_TPP");
      setComingFromTPP(comingFromTPP);
      if (comingFromTPP) {
        handleGetAuthenticationToken();
      }
    }

    checkTPPService();
  }, [navigation, comingFromTPP]);

  const handleOnSignUp = () => {
    navigation.navigate("Onboarding.Iqama");
  };

  const storeUserToLocalStorage = (user: UserType) => {
    setItemInEncryptedStorage("tempUser", JSON.stringify(user));
  };

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      const { NationalId, MobileNumber } = values;
      const response = await mutateAsync({ NationalId, MobileNumber });
      if (response.TotalRecords === 1) {
        setNotMatchRecord(false);
        storeUserToLocalStorage(response);
        navigation.navigate("SignIn.Passcode");
      } else if (response.TotalRecords === 0) {
        setNotMatchRecord(true);
      }
    } catch (err) {
      setNotMatchRecord(false);
      warn("signIn", "Could not process iqama input. Error: ", JSON.stringify(err));
    }
  };

  const accountSignInStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    flexDirection: "row",
    marginVertical: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <KeyboardAvoidingView behavior="height" style={styles.component}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.contentContainer}>
          <NavHeader withBackButton={!comingFromTPP} />
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
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
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
