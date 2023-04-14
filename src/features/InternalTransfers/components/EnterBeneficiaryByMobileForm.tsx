import { yupResolver } from "@hookform/resolvers/yup";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";

import ApiError from "@/api/ApiError";
import Button from "@/components/Button";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NotificationModal from "@/components/NotificationModal";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { saudiPhoneRegExp } from "@/utils";

import { useInternalTransferContext } from "../context/InternalTransfersContext";
import { useAddBeneficiary } from "../hooks/query-hooks";
import { AddBeneficiary, AddBeneficiarySelectionType, EnterBeneficiaryFormProps } from "../types";

interface EnterBeneficiaryByMobileInput {
  SelectionType: AddBeneficiarySelectionType;
  SelectionValue: string;
}

export default function EnterBeneficiaryByMobileForm({ selectionType }: EnterBeneficiaryFormProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const addBeneficiaryAsync = useAddBeneficiary();
  const { setAddBeneficiary, setRecipient } = useInternalTransferContext();

  const [isMobileInUseModalVisible, setIsMobileInUseModalVisible] = useState(false);
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        SelectionValue: Yup.string()
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

  const { control, setValue, handleSubmit } = useForm<EnterBeneficiaryByMobileInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      SelectionType: selectionType,
      SelectionValue: "",
    },
  });

  const handleOnSubmit = async (values: AddBeneficiary) => {
    try {
      const response = await addBeneficiaryAsync.mutateAsync({
        SelectionType: values.SelectionType,
        SelectionValue: values.SelectionValue.substring(4, values.SelectionValue.length), // remove +966 otherwise BE returns error
      });
      setAddBeneficiary({
        SelectionType: selectionType,
        SelectionValue: response.PhoneNumber || "",
      });
      setRecipient({
        accountName: response.Name,
        accountNumber: response.BankAccountNumber,
        phoneNumber: response.PhoneNumber,
        type: "new",
      });
      navigation.navigate("InternalTransfers.ConfirmNewBeneficiaryScreen");
    } catch (error) {
      if (error instanceof ApiError && error.errorContent.Message.includes(ERROR_BENEFICIARY_EXISTS)) {
        // For the error "MOBILE_NO beneficiary already exists" & "CRM_CUSTOMER beneficiary already exists"
        setIsMobileInUseModalVisible(true);
      } else {
        setIsGenericErrorModalVisible(true);
      }
      warn("Add Beneficiary", "Could not add beneficiary: ", JSON.stringify(error));
    }
  };

  const handleOnDifferentBeneficiaryPress = () => {
    setValue("SelectionValue", "");
    setIsMobileInUseModalVisible(false);
  };

  const handleOnCancelDifferentBeneficiaryPress = () => {
    setIsMobileInUseModalVisible(false);
  };

  const handleOnGenericErrorClose = () => {
    setIsGenericErrorModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <PhoneNumberInput
          control={control}
          name="SelectionValue"
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
  container: {
    flexGrow: 1,
  },
});

const ERROR_BENEFICIARY_EXISTS = "beneficiary already exists";
