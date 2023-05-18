import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import * as Yup from "yup";

import Banner from "@/components/Banner";
import ContentContainer from "@/components/ContentContainer";
import InputLabel from "@/components/Form/internal/InputLabel";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import InfoBox from "@/components/InfoBox";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { nationalIdRegEx, saudiPhoneRegExp } from "@/utils";

import { TOTAL_NATIONAL_ID_LENGTH, TOTAL_PHONE_LENGTH } from "../constants";
import { ErrorMessageType, IqamaInputs } from "../types";

interface MobileAndNationalIdFormProps {
  onSubmit: (values: IqamaInputs) => Promise<void>;
  onSignInPress: () => void;
  errorMessages: ErrorMessageType[];
}

export default function MobileAndNationalIdForm({
  onSubmit,
  onSignInPress,
  errorMessages,
}: MobileAndNationalIdFormProps) {
  const { t } = useTranslation();

  const iqamaValidationSchema = Yup.object().shape({
    MobileNumber: Yup.string()
      .required(t("SignIn.IqamaInputScreen.validationErrors.mobileNumber.required"))
      .matches(saudiPhoneRegExp, t("SignIn.IqamaInputScreen.validationErrors.mobileNumber.matches")),
    NationalId: Yup.string()
      .required(t("SignIn.IqamaInputScreen.validationErrors.iqamaId.required"))
      .matches(nationalIdRegEx, t("SignIn.IqamaInputScreen.validationErrors.iqamaId.matches"))
      .min(10, t("SignIn.IqamaInputScreen.validationErrors.iqamaId.exactLength"))
      .max(10, t("SignIn.IqamaInputScreen.validationErrors.iqamaId.exactLength")),
  });
  const { control, handleSubmit } = useForm<IqamaInputs>({
    resolver: yupResolver(iqamaValidationSchema),
    mode: "onBlur",
  });

  const headerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const headerTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
  }));

  const inputFieldsStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const accountSignInStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    flexDirection: "row",
    marginVertical: theme.spacing["20p"],
  }));

  const submitButtonView = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <>
      <ContentContainer isScrollView style={styles.containerStyle}>
        <View style={headerViewStyle}>
          <Typography.Text size="title1" weight="bold" style={headerTitleStyle}>
            {t("SignIn.IqamaInputScreen.title")}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular">
            {t("SignIn.IqamaInputScreen.subTitle")}
          </Typography.Text>
        </View>
        <View>
          <View style={inputFieldsStyle}>
            <Stack direction="vertical" align="stretch" gap="20p">
              <View>
                <InputLabel>{t("SignIn.IqamaInputScreen.mobileLabel")}</InputLabel>
                <View>
                  <PhoneNumberInput<IqamaInputs>
                    control={control}
                    name="MobileNumber"
                    showCharacterCount
                    maxLength={TOTAL_PHONE_LENGTH}
                    placeholder={t("SignIn.IqamaInputScreen.mobilePlaceholder")}
                  />
                </View>
              </View>
              <TextInput
                control={control}
                name="NationalId"
                label={t("SignIn.IqamaInputScreen.iqamaLabel")}
                placeholder={t("SignIn.IqamaInputScreen.iqamaPlaceholder")}
                keyboardType="number-pad"
                maxLength={TOTAL_NATIONAL_ID_LENGTH}
                showCharacterCount
              />
            </Stack>
          </View>
        </View>
        {errorMessages.map((err, index: number) =>
          typeof err.message === "string" ? (
            <Banner key={`err_${index}`} variant={err.backgroundColor} icon={err.icon} message={err.message} />
          ) : (
            <InfoBox key={`err_${index}`} variant="compliment" borderPosition="start">
              {err.link ? (
                <Pressable onPress={onSignInPress}>
                  <Typography.Text size="footnote" weight="regular">
                    {err.message}
                  </Typography.Text>
                </Pressable>
              ) : (
                <Typography.Text size="footnote" weight="regular">
                  {err.message}
                </Typography.Text>
              )}
            </InfoBox>
          )
        )}
      </ContentContainer>
      <View style={submitButtonView}>
        <SubmitButton block control={control} onSubmit={handleSubmit(onSubmit)}>
          {t("SignIn.IqamaInputScreen.continue")}
        </SubmitButton>
        <View style={accountSignInStyle}>
          <Typography.Text size="body" weight="regular">
            {t("SignIn.IqamaInputScreen.subtext")}
          </Typography.Text>
          <Pressable onPress={onSignInPress}>
            <Typography.Text size="body" weight="medium" color="primaryBase">
              {t("SignIn.IqamaInputScreen.signUp")}
            </Typography.Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
});
