import { yupResolver } from "@hookform/resolvers/yup";
import React, { ForwardedRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import * as Yup from "yup";

import { Typography } from "@/components";
import MaskedTextInput from "@/components/Form/MaskedTextInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import { Masks } from "@/components/Input";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { alphaRegExp, numericRegExp } from "@/utils";

import { AddBeneficiary, AddBeneficiaryFormForwardRef, EnterBeneficiaryFormProps } from "../types";

export default forwardRef(function EnterBeneficiaryByAccountNumberForm(
  { selectionType, onSubmit, testID, showQrCodeScan, accountNumber }: EnterBeneficiaryFormProps,
  ref: ForwardedRef<AddBeneficiaryFormForwardRef>
) {
  const { t } = useTranslation();
  const { transferType } = useInternalTransferContext();

  useImperativeHandle(ref, () => ({
    reset() {
      reset();
    },
    setValue,
  }));

  const validationSchema = useMemo(
    () =>
      Yup.object({
        SelectionValue: Yup.string()
          .matches(
            numericRegExp,
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumber.validation.invalid")
          )
          .test(
            "is-equal-to-account-number",
            t(
              "InternalTransfers.EnterBeneficiaryDetailsScreen.accountNumberForm.accountNumber.validation.sameAccountError"
            ),
            value => {
              return value !== accountNumber;
            }
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
        beneficiaryNickname: Yup.string()
          .notRequired()
          .matches(alphaRegExp, t("InternalTransfers.NewBeneficiaryScreen.nickname.validation.formatInvalid")),
      }),
    [t, transferType]
  );

  const { control, reset, handleSubmit, setValue } = useForm<AddBeneficiary>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      SelectionType: selectionType,
      SelectionValue: "",
      beneficiaryNickname: "",
    },
  });

  const textInputStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  const optionalTextStyle = useThemeStyles(theme => ({
    marginStart: theme.spacing["16p"],
  }));

  return (
    <>
      <View>
        <MaskedTextInput
          control={control}
          keyboardType="number-pad"
          name="SelectionValue"
          enableCrossClear
          onClear={() => setValue("SelectionValue", "")}
          mask={
            transferType === TransferType.CroatiaToArbTransferAction ? Masks.ACCOUNT_NUMBER_ARB : Masks.ACCOUNT_NUMBER
          }
          label={t("InternalTransfers.EnterBeneficiaryDetailsScreen.options.accountNumber")}
          showQrIcon={transferType === TransferType.CroatiaToArbTransferAction ? false : true}
          onQrScanPress={() => showQrCodeScan()}
        />
        <View style={textInputStyle}>
          <TextInput
            control={control}
            label={t("InternalTransfers.NewBeneficiaryScreen.nickname.optionalTitle")}
            name="beneficiaryNickname"
            placeholder={t("InternalTransfers.NewBeneficiaryScreen.nickname.optionalTitle")}
            testID={testID !== undefined ? `${testID}-NickNameTextInput` : undefined}
            onClear={() => setValue("beneficiaryNickname", "")}
          />
          <Typography.Text size="caption1" weight="regular" color="neutralBase" style={optionalTextStyle}>
            {t("InternalTransfers.NewBeneficiaryScreen.nickname.optionalText")}
          </Typography.Text>
        </View>
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
