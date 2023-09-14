import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import Alert from "@/components/Alert";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NumberPad from "@/components/NumberPad";
import Page from "@/components/Page";
import PasscodeInput from "@/components/PasscodeInput";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { isSequential, maxRepeatThresholdMet } from "@/utils/is-valid-pin";
import westernArabicNumerals from "@/utils/western-arabic-numerals";

import { PASSCODE_LENGTH } from "../constants";

export default function CreatePasscodeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState("");

  const errorMessages = [
    {
      message: t("Onboarding.CreatePasscode.notification"),
      icon: <ErrorFilledCircleIcon />,
    },
  ];

  const handleOnChangeText = (input: string) => {
    setCurrentValue(input);
    if (!input) return;

    const convertedInput = westernArabicNumerals(input);

    if (maxRepeatThresholdMet(convertedInput) || (input.length === PASSCODE_LENGTH && isSequential(convertedInput))) {
      setIsErrorVisible(true);
      setCurrentValue("");
    } else {
      setIsErrorVisible(false);
      if (input.length === PASSCODE_LENGTH) {
        navigation.navigate("Onboarding.ConfirmPasscode", { passcode: input });
      }
    }
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={false} testID="Onboarding.CreatePasscodeScreen:NavHeader" />
      <ContentContainer>
        <PasscodeInput
          errorMessage={errorMessages}
          title={t("Onboarding.CreatePasscode.title")}
          subTitle={t("Onboarding.CreatePasscode.subTitle")}
          isError={isErrorVisible}
          length={6}
          passcode={currentValue}
          testID="Onboarding.CreatePasscodeScreen:PasscodeInput"
        />

        <Alert variant="default" message={t("SignIn.CreatePasscodeScreen.needHelpInfo")} />
      </ContentContainer>

      <NumberPad passcode={currentValue} setPasscode={handleOnChangeText} />
    </Page>
  );
}
