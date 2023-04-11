import { yupResolver } from "@hookform/resolvers/yup";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";
import * as Yup from "yup";

import Button from "@/components/Button";
import MaskedTextInput from "@/components/Form/MaskedTextInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NotificationModal from "@/components/NotificationModal";
import useNavigation from "@/navigation/use-navigation";
import { ibanRegExp } from "@/utils";

interface EnterBeneficiaryByIBANInput {
  IBAN: string;
}

export default function EnterBeneficiaryByIBANForm() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isIBANInUseModalVisible, setIsIBANInUseModalVisible] = useState(false);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        IBAN: Yup.string()
          .required(t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.iban.validation.required"))
          .min(24, t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.iban.validation.minLength"))
          .matches(ibanRegExp, t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.iban.validation.invalid")),
      }),
    [t]
  );

  const { control, handleSubmit } = useForm<EnterBeneficiaryByIBANInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      IBAN: "",
    },
  });

  const handleOnSubmit = () => {
    navigation.navigate("InternalTransfers.ConfirmNewBeneficiaryScreen");
  };

  const handleOnDifferentBeneficiaryPress = () => {
    Alert.alert("Choose different beneficiary is pressed"); // TODO
  };

  const handleOnCancelDifferentBeneficiaryPress = () => {
    setIsIBANInUseModalVisible(false);
  };

  return (
    <>
      <View>
        <MaskedTextInput
          control={control}
          name="IBAN"
          placeholder={t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.iban.placeholder")}
          maxLength={24}
          showCharacterCount
          mask="SA## #### #### #### #### ####"
        />
      </View>
      <View style={styles.buttonContainer}>
        <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
          {t("InternalTransfers.EnterBeneficiaryDetailsScreen.continueButton")}
        </SubmitButton>
      </View>
      <NotificationModal
        buttons={{
          primary: (
            <Button onPress={() => handleOnDifferentBeneficiaryPress()}>
              {t(
                "InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.ibanInUseModal.chooseDifferentBeneficiaryButton"
              )}
            </Button>
          ),
          secondary: (
            <Button onPress={() => handleOnCancelDifferentBeneficiaryPress()}>
              {t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.ibanInUseModal.cancelButton")}
            </Button>
          ),
        }}
        title={t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.ibanInUseModal.title")}
        message={t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.ibanInUseModal.message")}
        isVisible={isIBANInUseModalVisible}
        variant="error"
      />
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: "auto",
  },
});
