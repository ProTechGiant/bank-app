import { useEffect } from "react";

import ApiError from "@/api/ApiError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { generateRandomId } from "@/utils";

import { MobileAndNationalIdForm } from "../components";
import { useSignInContext } from "../contexts/SignInContext";
import { useErrorMessages } from "../hooks";
import { useIqama } from "../hooks/query-hooks";

export default function IqamaInputScreen() {
  const navigation = useNavigation();
  const { error, reset } = useIqama();
  const iqamaError = error as ApiError;
  const { errorMessages } = useErrorMessages(iqamaError);
  const { setSignInCorrelationId } = useSignInContext();

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

  const handleOnSubmit = async () => {
    try {
      // setNationalId(String(values.NationalId));
      // await mutateAsync(values);
      navigation.navigate("SignIn.Passcode");
      // if (await biometricsService.isSensorAvailable()) navigation.navigate("SignIn.Biometric");
      // else navigation.navigate("Home.HomeStack");
    } catch (err) {
      warn("signIn", "Could not process iqama input. Error: ", JSON.stringify(err));
    }
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={true} />
      <MobileAndNationalIdForm onSubmit={handleOnSubmit} errorMessages={errorMessages} onSignInPress={handleOnSignUp} />
    </Page>
  );
}
