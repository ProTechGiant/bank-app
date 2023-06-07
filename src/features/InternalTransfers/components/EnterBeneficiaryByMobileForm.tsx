import { yupResolver } from "@hookform/resolvers/yup";
import React, { ForwardedRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";

import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import { saudiPhoneRegExp } from "@/utils";

import { AddBeneficiary, AddBeneficiaryFormForwardRef, EnterBeneficiaryFormProps } from "../types";

export default forwardRef(function EnterBeneficiaryByMobileForm(
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
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileNumber.validation.required")
          )
          .matches(
            saudiPhoneRegExp,
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileNumber.validation.invalid")
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
      <View style={styles.container}>
        <PhoneNumberInput
          control={control}
          name="SelectionValue"
          label={t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileNumber.placeholder")}
        />
        <View style={styles.buttonContainer}>
          <SubmitButton control={control} onSubmit={handleSubmit(onSubmit)}>
            {t("InternalTransfers.EnterBeneficiaryDetailsScreen.continueButton")}
          </SubmitButton>
        </View>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: "auto",
  },
  container: {
    flexGrow: 1,
  },
});
