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

interface EnterBeneficiaryByAccountNumberInput {
  AccountNumber: string;
}

export default function EnterBeneficiaryByAccountNumberForm() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isAccountNumberInUseModalVisible, setIsAccountNumberInUseModalVisible] = useState(false);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        AccountNumber: Yup.string()
          .required(
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumber.validation.required")
          )
          .min(
            12,
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumber.validation.invalid")
          ),
      }),
    [t]
  );

  const { control, handleSubmit } = useForm<EnterBeneficiaryByAccountNumberInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      AccountNumber: "",
    },
  });

  const handleOnSubmit = () => {
    navigation.navigate("InternalTransfers.ConfirmNewBeneficiaryScreen");
  };

  const handleOnDifferentBeneficiaryPress = () => {
    Alert.alert("Choose different beneficiary is pressed"); // TODO
  };

  const handleOnCancelDifferentBeneficiaryPress = () => {
    setIsAccountNumberInUseModalVisible(false);
  };

  return (
    <>
      <View>
        <MaskedTextInput
          control={control}
          keyboardType="number-pad"
          name="AccountNumber"
          placeholder={t("InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumber.placeholder")}
          maxLength={12}
          showCharacterCount
          mask="#### #### ####"
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
                "InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumberInUseModal.chooseDifferentBeneficiaryButton"
              )}
            </Button>
          ),
          secondary: (
            <Button onPress={() => handleOnCancelDifferentBeneficiaryPress()}>
              {t(
                "InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumberInUseModal.cancelButton"
              )}
            </Button>
          ),
        }}
        title={t("InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumberInUseModal.title")}
        message={t("InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumberInUseModal.message")}
        isVisible={isAccountNumberInUseModalVisible}
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
