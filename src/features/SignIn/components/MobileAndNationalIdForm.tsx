import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import * as Yup from "yup";

import { InfoFilledCircleIcon } from "@/assets/icons";
import Alert from "@/components/Alert";
import ContentContainer from "@/components/ContentContainer";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import InfoBox from "@/components/InfoBox";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { nationalIdRegEx, saudiPhoneRegExp } from "@/utils";

import { TOTAL_NATIONAL_ID_LENGTH } from "../constants";
import { ErrorMessageType, IqamaInputs } from "../types";

interface MobileAndNationalIdFormProps {
  onSubmit: (values: IqamaInputs) => Promise<void>;
  onSignInPress?: () => void;
  errorMessages: ErrorMessageType[];
  notMatchRecord: boolean;
  title: string;
  subTitle: string;
  buttonText: string;
}

export default function MobileAndNationalIdForm({
  onSubmit,
  onSignInPress,
  errorMessages,
  notMatchRecord,
  title,
  subTitle,
  buttonText,
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

  const submitButtonView = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  const warningStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["errorBase-40"],
    borderRadius: theme.radii.small,
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["12p"],
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette["errorBase-10"]);

  return (
    <>
      <ContentContainer isScrollView style={styles.containerStyle}>
        <View style={headerViewStyle}>
          <Typography.Text size="title1" weight="medium" style={headerTitleStyle}>
            {title}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular">
            {subTitle}
          </Typography.Text>
        </View>
        <View>
          <View style={inputFieldsStyle}>
            <Stack direction="vertical" align="stretch" gap="16p">
              <PhoneNumberInput<IqamaInputs>
                control={control}
                name="MobileNumber"
                label={t("SignIn.IqamaInputScreen.mobileLabel")}
                placeholder={t("SignIn.IqamaInputScreen.mobilePlaceholder")}
              />
              <TextInput
                control={control}
                name="NationalId"
                label={t("SignIn.IqamaInputScreen.iqamaLabel")}
                placeholder={t("SignIn.IqamaInputScreen.iqamaPlaceholder")}
                keyboardType="number-pad"
                maxLength={TOTAL_NATIONAL_ID_LENGTH}
                showCharacterCount
              />
              {notMatchRecord ? (
                <Stack style={warningStyle} direction="horizontal" gap="12p">
                  <InfoFilledCircleIcon width={16} height={16} color={infoIconColor} />
                  <Typography.Text size="footnote" weight="regular" color="neutralBase+30">
                    {t("SignIn.IqamaInputScreen.errorText.noMatchRecord")}
                  </Typography.Text>
                </Stack>
              ) : null}
            </Stack>
          </View>
        </View>
        {errorMessages.map((err, index: number) =>
          typeof err.message === "string" ? (
            <Alert key={`err_${index}`} variant={err.variant} message={err.message} />
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
          {buttonText}
        </SubmitButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
});
