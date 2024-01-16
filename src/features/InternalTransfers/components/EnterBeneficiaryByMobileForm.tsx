import { yupResolver } from "@hookform/resolvers/yup";
import React, { ForwardedRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import * as Yup from "yup";

import { Typography } from "@/components";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import { useThemeStyles } from "@/theme";
import { alphaRegExp, saudiPhoneRegExp } from "@/utils";

import { AddBeneficiary, AddBeneficiaryFormForwardRef, EnterBeneficiaryMobileFormProps } from "../types";
import { formatContactNumberToSaudi } from "../utils";
import { SelectedContact } from "./index";

export default forwardRef(function EnterBeneficiaryByMobileForm(
  {
    selectionType,
    onSubmit,
    testID,
    contact,
    onCancelContactPress,
    onContactPress,
    usersValue,
  }: EnterBeneficiaryMobileFormProps,
  ref: ForwardedRef<AddBeneficiaryFormForwardRef>
) {
  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    reset() {
      reset();
    },
    setSelectionValue,
  }));

  const setSelectionValue = (selectionValue: string) => {
    setValue("SelectionValue", selectionValue);
    trigger("SelectionValue");
  };

  const validationSchema = useMemo(
    () =>
      Yup.object({
        SelectionValue: Yup.string()
          .matches(
            saudiPhoneRegExp,
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileNumber.validation.invalid")
          )
          .test(
            "is-equal-to-phone-number",
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.sameAccountNotAllowed"),
            value => {
              return value !== usersValue;
            }
          )
          .required(
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileNumber.validation.required")
          )
          .min(
            9,
            t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileNumber.validation.invalid")
          ),
        beneficiaryNickname: Yup.string()
          .notRequired()
          .matches(alphaRegExp, t("InternalTransfers.NewBeneficiaryScreen.nickname.validation.formatInvalid")),
      }),
    [t]
  );

  const { control, reset, handleSubmit, setValue, trigger } = useForm<AddBeneficiary>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      SelectionType: selectionType,
      SelectionValue: "",
      beneficiaryNickname: "",
    },
  });

  const textInputStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
  }));

  const optionalTextStyle = useThemeStyles(theme => ({
    marginStart: theme.spacing["16p"],
  }));

  return (
    <>
      <View style={styles.container}>
        {contact !== undefined ? (
          <SelectedContact
            fullName={contact.name}
            contactInfo={formatContactNumberToSaudi(contact.phoneNumber)}
            onCancelPress={onCancelContactPress}
            testID="InternalTransfers.InternalTransferCTCAndCTAScreen"
          />
        ) : (
          <>
            <PhoneNumberInput
              onClear={() => setValue("SelectionValue", "")}
              control={control}
              name="SelectionValue"
              label={t("InternalTransfers.EnterBeneficiaryDetailsScreen.mobileNumberForm.mobileNumber.placeholder")}
              testID={testID !== undefined ? `${testID}-PhoneNumberInput` : undefined}
              onContactPress={onContactPress}
            />
          </>
        )}

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
        <View style={styles.buttonContainer}>
          <SubmitButton
            control={control}
            onSubmit={handleSubmit(onSubmit)}
            testID={testID !== undefined ? `${testID}-ContinueButton` : undefined}>
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
