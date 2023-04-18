import { yupResolver } from "@hookform/resolvers/yup";
import React, { ForwardedRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";

import MaskedTextInput from "@/components/Form/MaskedTextInput";
import SubmitButton from "@/components/Form/SubmitButton";

import { AddBeneficiary, AddBeneficiaryFormForwardRef, EnterBeneficiaryFormProps } from "../types";

export default forwardRef(function EnterBeneficiaryByAccountNumberForm(
  { selectionType, onSubmit }: EnterBeneficiaryFormProps,
  ref: ForwardedRef<AddBeneficiaryFormForwardRef>
) {
  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    reset() {
      reset();
    },
  }));

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

  const { control, reset, handleSubmit } = useForm<AddBeneficiary>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      SelectionType: selectionType,
      SelectionValue: "",
    },
  });

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
        <SubmitButton control={control} onSubmit={handleSubmit(onSubmit)}>
          {t("InternalTransfers.EnterBeneficiaryDetailsScreen.continueButton")}
        </SubmitButton>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: "auto",
  },
});
