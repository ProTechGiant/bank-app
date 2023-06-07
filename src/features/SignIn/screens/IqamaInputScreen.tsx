import { useEffect } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";

import ApiError from "@/api/ApiError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { generateRandomId } from "@/utils";

import { MobileAndNationalIdForm } from "../components";
import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import { useCheckUser } from "../hooks/query-hooks";
import { IqamaInputs } from "../types";

export default function IqamaInputScreen() {
  const navigation = useNavigation();
  const { mutateAsync, error, reset } = useCheckUser();
  const iqamaError = error as ApiError;
  const { errorMessages } = useErrorMessages(iqamaError);
  const { setSignInCorrelationId, setIsPasscodeCreated } = useSignInContext();

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

  const handleOnSignUp = () => {
    navigation.navigate("Onboarding.OnboardingStack");
  };

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      const response = await mutateAsync(values);
      if (response.HasPasscode) navigation.navigate("SignIn.Passcode");
      else {
        setIsPasscodeCreated(false);
        navigation.navigate("SignIn.CreatePasscode");
      }
    } catch (err) {
      warn("signIn", "Could not process iqama input. Error: ", JSON.stringify(err));
    }
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <KeyboardAvoidingView behavior="height" style={styles.component}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.contentContainer}>
          <NavHeader withBackButton={true} />
          <MobileAndNationalIdForm
            onSubmit={handleOnSubmit}
            errorMessages={errorMessages}
            onSignInPress={handleOnSignUp}
          />
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
});
