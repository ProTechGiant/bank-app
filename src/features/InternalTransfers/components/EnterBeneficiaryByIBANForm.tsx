import { yupResolver } from "@hookform/resolvers/yup";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";

import ApiError from "@/api/ApiError";
import Button from "@/components/Button";
import MaskedTextInput from "@/components/Form/MaskedTextInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NotificationModal from "@/components/NotificationModal";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { ibanRegExp } from "@/utils";

import { useAddBeneficiary } from "../hooks/query-hooks";
import { AddBeneficiary, AddBeneficiarySelectionType, EnterBeneficiaryFormProps } from "../types";

interface EnterBeneficiaryByIBANInput {
  SelectionType: AddBeneficiarySelectionType;
  SelectionValue: string;
}

export default function EnterBeneficiaryByIBANForm({ selectionType }: EnterBeneficiaryFormProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const addBeneficiaryAsync = useAddBeneficiary();

  const [isIBANInUseModalVisible, setIsIBANInUseModalVisible] = useState(false);
  const [isIBANNotRecognisedModalVisible, setIsIBANNotRecognisedModalVisible] = useState(false);
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        SelectionValue: Yup.string()
          .required(t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.iban.validation.required"))
          .min(24, t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.iban.validation.minLength"))
          .matches(ibanRegExp, t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.iban.validation.invalid")),
      }),
    [t]
  );

  const { control, setValue, handleSubmit } = useForm<EnterBeneficiaryByIBANInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      SelectionType: selectionType,
      SelectionValue: "",
    },
  });

  const handleOnSubmit = async (values: AddBeneficiary) => {
    try {
      const response = await addBeneficiaryAsync.mutateAsync(values);
      navigation.navigate("InternalTransfers.ConfirmNewBeneficiaryScreen", {
        name: response.Name,
        selectionType: selectionType,
        selectionValue: response.IBAN || "",
      });
    } catch (error) {
      if (error instanceof ApiError && error.errorContent.Message === "Account does not exist") {
        setIsIBANNotRecognisedModalVisible(true);
      } else if (error instanceof ApiError && error.errorContent.Message === "IBAN beneficiary already exists") {
        setIsIBANInUseModalVisible(true);
      } else {
        setIsGenericErrorModalVisible(true);
      }
      warn("Add Beneficiary", "Could not add beneficiary: ", JSON.stringify(error));
    }
  };

  const handleOnDifferentBeneficiaryPress = () => {
    setValue("SelectionValue", "");
    setIsIBANInUseModalVisible(false);
  };

  const handleOnCancelDifferentBeneficiaryPress = () => {
    setIsIBANInUseModalVisible(false);
  };

  const handleOnIBANNotRecognisedModalClose = () => {
    setIsIBANNotRecognisedModalVisible(false);
  };

  const handleOnGenericErrorClose = () => {
    setIsGenericErrorModalVisible(false);
  };

  return (
    <>
      <View>
        <MaskedTextInput
          control={control}
          name="SelectionValue"
          placeholder={t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.iban.placeholder")}
          maxLength={24}
          showCharacterCount
          mask="SA## #### #### #### #### ####"
          autoCapitalize="characters"
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
      <NotificationModal
        title={t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.ibanNotRecognisedModal.title")}
        message={t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.ibanNotRecognisedModal.message")}
        isVisible={isIBANNotRecognisedModalVisible}
        variant="error"
        onClose={() => handleOnIBANNotRecognisedModalClose()}
      />
      <NotificationModal
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isGenericErrorModalVisible}
        variant="error"
        onClose={() => handleOnGenericErrorClose()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: "auto",
  },
});
