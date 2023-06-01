import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";
import * as Yup from "yup";

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

import { ErrorMessageType, IqamaInputs } from "../types";

const iqamaValidationSchema = Yup.object().shape({
  MobileNumber: Yup.string().required("Mobile Required").matches(saudiPhoneRegExp, "Mobile number is not valid"),
  NationalId: Yup.string()
    .required("National ID/Iqama Number required")
    .matches(nationalIdRegEx, "Invalid Number")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),
});

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
  const { control, handleSubmit } = useForm<IqamaInputs>({
    resolver: yupResolver(iqamaValidationSchema),
    mode: "onBlur",
  });

  const headerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const headerTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
  }));

  const inputFieldsStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const accountSignInStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    flexDirection: "row",
    marginTop: theme.spacing["8p"],
  }));

  const submitButtonView = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <>
      <ContentContainer isScrollView style={{ flex: 1 }}>
        <View style={headerViewStyle}>
          <Typography.Text size="large" weight="bold" style={headerTitleStyle}>
            {t("Onboarding.IqamaInputScreen.title")}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular">
            {t("Onboarding.IqamaInputScreen.subTitle")}
          </Typography.Text>
        </View>
        <View>
          <View style={inputFieldsStyle}>
            <Stack direction="vertical" align="stretch" gap="20p">
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
              <PhoneNumberInput
                control={control}
                name="MobileNumber"
                label={t("Onboarding.IqamaInputScreen.mobileLabel")}
                placeholder={t("Onboarding.IqamaInputScreen.mobilePlaceholder")}
                maxLength={9}
                showCharacterCount
              />
              <TextInput
                control={control}
                name="NationalId"
                label={t("Onboarding.IqamaInputScreen.iqamaLabel")}
                placeholder={t("Onboarding.IqamaInputScreen.iqamaPlaceholder")}
                keyboardType="number-pad"
              />
              <InfoBox variant="primary" borderPosition="start">
                {t("Onboarding.IqamaInputScreen.notificationText.one")}
                <Typography.Text color="neutralBase+30" size="caption1" weight="bold">
                  {t("Onboarding.IqamaInputScreen.notificationText.two")}
                </Typography.Text>
                {t("Onboarding.IqamaInputScreen.notificationText.three")}
              </InfoBox>
            </Stack>
          </View>
        </View>
      </ContentContainer>
      <View style={submitButtonView}>
        <SubmitButton block control={control} onSubmit={handleSubmit(onSubmit)}>
          {t("Onboarding.IqamaInputScreen.continue")}
        </SubmitButton>
        <View style={accountSignInStyle}>
          <Typography.Text size="callout" weight="regular">
            {t("Onboarding.IqamaInputScreen.subtext")}
          </Typography.Text>
          <Pressable onPress={onSignInPress}>
            <Typography.Text size="callout" weight="regular" color="primaryBase">
              {t("Onboarding.IqamaInputScreen.signIn")}
            </Typography.Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
