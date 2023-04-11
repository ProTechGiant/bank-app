import { yupResolver } from "@hookform/resolvers/yup";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";
import * as Yup from "yup";

import Button from "@/components/Button";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NotificationModal from "@/components/NotificationModal";
import useNavigation from "@/navigation/use-navigation";
import { saudiPhoneRegExp } from "@/utils";

interface EnterBeneficiaryByMobileInput {
  MobileNumber: string;
}

export default function EnterBeneficiaryByMobileForm() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isMobileInUseModalVisible, setIsMobileInUseModalVisible] = useState(false);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        MobileNumber: Yup.string()
          .required(
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileNumber.validation.required")
          )
          .matches(
            saudiPhoneRegExp,
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileNumber.validation.invalid")
          ),
      }),
    [t]
  );

  const { control, handleSubmit } = useForm<EnterBeneficiaryByMobileInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      MobileNumber: "",
    },
  });

  const handleOnSubmit = () => {
    navigation.navigate("InternalTransfers.ConfirmNewBeneficiaryScreen");
  };

  const handleOnDifferentBeneficiaryPress = () => {
    Alert.alert("Choose different beneficiary is pressed"); // TODO
  };

  const handleOnCancelDifferentBeneficiaryPress = () => {
    setIsMobileInUseModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <PhoneNumberInput
          control={control}
          name="MobileNumber"
          placeholder={t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileNumber.placeholder")}
          maxLength={9}
          showCharacterCount
        />
        <View style={styles.buttonContainer}>
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            {t("InternalTransfers.EnterBeneficiaryDetailsScreen.continueButton")}
          </SubmitButton>
        </View>
      </View>
      <NotificationModal
        buttons={{
          primary: (
            <Button onPress={() => handleOnDifferentBeneficiaryPress()}>
              {t(
                "InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileInUseModal.chooseDifferentBeneficiaryButton"
              )}
            </Button>
          ),
          secondary: (
            <Button onPress={() => handleOnCancelDifferentBeneficiaryPress()}>
              {t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileInUseModal.cancelButton")}
            </Button>
          ),
        }}
        title={t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileInUseModal.title")}
        message={t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileInUseModal.message")}
        isVisible={isMobileInUseModalVisible}
        variant="error"
      />
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: "auto",
  },
  container: {
    flexGrow: 1,
  },
});
