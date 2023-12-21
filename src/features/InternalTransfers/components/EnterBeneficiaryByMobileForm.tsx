import { yupResolver } from "@hookform/resolvers/yup";
import React, { ForwardedRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import * as Yup from "yup";

import { ContactIcon } from "@/assets/icons";
import { Typography } from "@/components";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import { InlineBanner } from "@/features/CardActions/components";
import InlineBannerButton from "@/features/CardActions/components/InlineBanner/InlineBannerButton";
import { useThemeStyles } from "@/theme";
import { alphaRegExp, saudiPhoneRegExp } from "@/utils";

import { AddBeneficiary, AddBeneficiaryFormForwardRef, EnterBeneficiaryMobileFormProps } from "../types";
import { SelectedContact } from "./index";

export default forwardRef(function EnterBeneficiaryByMobileForm(
  {
    selectionType,
    onSubmit,
    testID,
    contact,
    onCancelContactPress,
    onContactPress,
    isPermissionDenied,
    onBannerClosePress,
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
  };

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
    marginVertical: theme.spacing["24p"],
  }));

  const inlineBannerButtonStyle = useThemeStyles(theme => ({
    borderRadius: theme.spacing["24p"],
    borderWidth: 0.5,
  }));

  const inlineBannerContainerStyle = useThemeStyles(theme => ({
    marginTop: theme.spacing["20p"],
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
            contactInfo={contact.phoneNumber}
            onCancelPress={onCancelContactPress}
            testID="InternalTransfers.InternalTransferCroatiaToCroatiaScreen"
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
            {isPermissionDenied !== undefined && isPermissionDenied ? (
              <View style={inlineBannerContainerStyle}>
                <InlineBanner
                  action={
                    <InlineBannerButton
                      text={t(
                        "InternalTransfers.InternalTransferCroatiaToCroatiaScreen.permissionInlineBanner.allowAccessbutton"
                      )}
                      onPress={onContactPress}
                      style={inlineBannerButtonStyle}
                    />
                  }
                  onClose={onBannerClosePress}
                  icon={<ContactIcon />}
                  title={t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.permissionInlineBanner.title")}
                  text={t(
                    "InternalTransfers.InternalTransferCroatiaToCroatiaScreen.permissionInlineBanner.description"
                  )}
                  testID="CardActions.InternalTransferCroatiaToCroatiaScreen:PermissionDeclineInlineBanner"
                />
              </View>
            ) : null}
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
