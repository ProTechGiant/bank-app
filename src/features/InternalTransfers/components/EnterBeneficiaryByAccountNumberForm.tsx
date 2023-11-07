import { yupResolver } from "@hookform/resolvers/yup";
import React, { ForwardedRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";

import MaskedTextInput from "@/components/Form/MaskedTextInput";
import SubmitButton from "@/components/Form/SubmitButton";
import { Masks } from "@/components/Input";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { TransferType } from "@/types/InternalTransfer";
import { numericRegExp } from "@/utils";

import { AddBeneficiary, AddBeneficiaryFormForwardRef, EnterBeneficiaryFormProps } from "../types";

export default forwardRef(function EnterBeneficiaryByAccountNumberForm(
  { selectionType, onSubmit }: EnterBeneficiaryFormProps,
  ref: ForwardedRef<AddBeneficiaryFormForwardRef>
) {
  const { t } = useTranslation();
  const { transferType } = useInternalTransferContext();

  useImperativeHandle(ref, () => ({
    reset() {
      reset();
    },
  }));

  const validationSchema = useMemo(
    () =>
      Yup.object({
        SelectionValue: Yup.string()
          .matches(
            numericRegExp,
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumber.validation.invalid")
          )
          .required(
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumber.validation.required")
          )
          .min(
            transferType === TransferType.CroatiaToArbTransferAction ? 21 : 9,
            transferType === TransferType.CroatiaToArbTransferAction
              ? t(
                  "InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumber.validation.invalidArbAccount"
                )
              : t("InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumber.validation.invalid")
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
          mask={
            transferType === TransferType.CroatiaToArbTransferAction ? Masks.ACCOUNT_NUMBER_ARB : Masks.ACCOUNT_NUMBER
          }
          label={t("InternalTransfers.EnterBeneficiaryDetailsScreen.options.accountNumber")}
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
