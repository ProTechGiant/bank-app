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

import { useInternalTransferContext } from "../context/InternalTransfersContext";
import { useAddBeneficiary } from "../hooks/query-hooks";
import { AddBeneficiary, AddBeneficiarySelectionType, EnterBeneficiaryFormProps } from "../types";

interface EnterBeneficiaryByAccountNumberInput {
  SelectionType: AddBeneficiarySelectionType;
  SelectionValue: string;
}

export default function EnterBeneficiaryByAccountNumberForm({ selectionType }: EnterBeneficiaryFormProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const addBeneficiaryAsync = useAddBeneficiary();
  const { setAddBeneficiary, setRecipient } = useInternalTransferContext();

  const [isAccountNumberInUseModalVisible, setIsAccountNumberInUseModalVisible] = useState(false);
  const [isAccountNumberNotRecognisedModalVisible, setIsAccountNumberNotRecognisedModalVisible] = useState(false);
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        SelectionValue: Yup.string()
          .required(
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumber.validation.required")
          )
          .min(
            9,
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumber.validation.invalid")
          ),
      }),
    [t]
  );

  const { control, setValue, handleSubmit } = useForm<EnterBeneficiaryByAccountNumberInput>({
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
      setAddBeneficiary({
        SelectionType: selectionType,
        SelectionValue: response.BankAccountNumber || "",
      });
      setRecipient({
        accountName: response.Name,
        accountNumber: response.BankAccountNumber,
        phoneNumber: response.PhoneNumber,
        type: "new",
      });
      navigation.navigate("InternalTransfers.ConfirmNewBeneficiaryScreen");
    } catch (error) {
      if (error instanceof ApiError && error.errorContent.Message === "Account does not exist") {
        setIsAccountNumberNotRecognisedModalVisible(true);
      } else if (error instanceof ApiError && error.errorContent.Message === "ACCOUNT_ID beneficiary already exists") {
        setIsAccountNumberInUseModalVisible(true);
      } else {
        setIsGenericErrorModalVisible(true);
      }
      warn("Add Beneficiary", "Could not add beneficiary: ", JSON.stringify(error));
    }
  };

  const handleOnDifferentBeneficiaryPress = () => {
    setValue("SelectionValue", "");
    setIsAccountNumberInUseModalVisible(false);
  };

  const handleOnCancelDifferentBeneficiaryPress = () => {
    setIsAccountNumberInUseModalVisible(false);
  };

  const handleOnAccountNumberNotRecognisedModalClose = () => {
    setIsAccountNumberNotRecognisedModalVisible(false);
  };

  const handleOnGenericErrorClose = () => {
    setIsGenericErrorModalVisible(false);
  };

  return (
    <>
      <View>
        <MaskedTextInput
          control={control}
          keyboardType="number-pad"
          name="SelectionValue"
          placeholder={t("InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumber.placeholder")}
          maxLength={9}
          showCharacterCount
          mask="## ## ## ## #"
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
      <NotificationModal
        title={t(
          "InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumberNotRecognisedModal.title"
        )}
        message={t(
          "InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumberNotRecognisedModal.message"
        )}
        isVisible={isAccountNumberNotRecognisedModalVisible}
        variant="error"
        onClose={() => handleOnAccountNumberNotRecognisedModalClose()}
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
