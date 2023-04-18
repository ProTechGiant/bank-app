import { yupResolver } from "@hookform/resolvers/yup";
import React, { ForwardedRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";

import MaskedTextInput from "@/components/Form/MaskedTextInput";
import SubmitButton from "@/components/Form/SubmitButton";
import { ibanRegExp } from "@/utils";

import { AddBeneficiary, AddBeneficiaryFormForwardRef, EnterBeneficiaryFormProps } from "../types";

export default forwardRef(function EnterBeneficiaryByIBANForm(
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
          .required(t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.iban.validation.required"))
          .min(24, t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.iban.validation.minLength"))
          .matches(ibanRegExp, t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.iban.validation.invalid")),
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
          name="SelectionValue"
          placeholder={t("InternalTransfers.EnterBeneficiaryDetailsScreen.ibanForm.iban.placeholder")}
          maxLength={24}
          showCharacterCount
          mask="SA## #### #### #### #### ####"
          autoCapitalize="characters"
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
