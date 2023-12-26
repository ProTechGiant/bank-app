import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import * as Yup from "yup";

import { ErrorCircleIcon } from "@/assets/icons";
import { Link } from "@/components";
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
  isNafathErrorExists?: boolean;
}

export default function MobileAndNationalIdForm({
  onSubmit,
  onSignInPress,
  errorMessages,
  isNafathErrorExists,
}: MobileAndNationalIdFormProps) {
  const { t } = useTranslation();
  const { control, handleSubmit, setValue, getValues } = useForm<IqamaInputs>({
    resolver: yupResolver(iqamaValidationSchema),
    mode: "onBlur",
  });

  const headerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const headerTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["8p"],
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
    marginBottom: theme.spacing["8p"],
  }));

  const errorContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    paddingVertical: theme.spacing["24p"],
    alignSelf: "center",
    paddingRight: theme.spacing["32p"],
    paddingLeft: theme.spacing["12p"],
    backgroundColor: theme.palette["errorBase-30"],
    borderRadius: theme.spacing["12p"],
  }));

  return (
    <>
      <ContentContainer scrollEnabled={true} isScrollView style={styles.container}>
        <StatusBar barStyle="dark-content" translucent />
        <View style={headerViewStyle}>
          <Typography.Text color="neutralBase+30" size="large" weight="medium" style={headerTitleStyle}>
            {t("Onboarding.IqamaInputScreen.title")}
          </Typography.Text>
          <Typography.Text color="neutralBase+10" size="callout" weight="regular">
            {t("Onboarding.IqamaInputScreen.subTitle")}
          </Typography.Text>
        </View>
        <View style={inputFieldsStyle}>
          <Stack direction="vertical" align="stretch" gap="24p">
            {errorMessages.map((err, index: number) =>
              typeof err.message === "string" ? (
                <Alert key={`err_${index}`} variant={err.variant} message={err.message} />
              ) : (
                <InfoBox key={`err_${index}`} variant="primary" borderPosition="start">
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
            {isNafathErrorExists ? (
              <Stack direction="horizontal" gap="12p" style={errorContainerStyle}>
                <Typography.Text size="callout" weight="medium" color="primaryBase-40">
                  <ErrorCircleIcon />
                </Typography.Text>
                <Stack direction="vertical" flex={1}>
                  <Typography.Text size="footnote" weight="regular" color="neutralBase+30">
                    {t("Onboarding.IqamaInputScreen.failedToReceiveNafathDetails")}
                  </Typography.Text>
                </Stack>
              </Stack>
            ) : null}
            <PhoneNumberInput
              value={getValues("MobileNumber")}
              onChangeText={value => setValue("MobileNumber", value)}
              onClear={() => setValue("MobileNumber", "")}
              control={control}
              name="MobileNumber"
              label={t("Onboarding.IqamaInputScreen.mobileLabel")}
              testID="Onboarding.IqamaInputScreen:PhoneNumberInput"
            />
            <TextInput
              value={getValues("NationalId")}
              onChangeText={value => setValue("NationalId", value)}
              onClear={() => setValue("NationalId", "")}
              control={control}
              name="NationalId"
              label={t("Onboarding.IqamaInputScreen.iqamaLabel")}
              placeholder={t("Onboarding.IqamaInputScreen.iqamaLabel")}
              keyboardType="number-pad"
              showCharacterCount
              maxLength={10}
              testID="Onboarding.IqamaInputScreen:NationalIdInput"
            />
            {errorMessages.length === 0 ? (
              <InfoBox variant="primary" borderPosition="start">
                {t("Onboarding.IqamaInputScreen.notificationText.one")}
                {t("Onboarding.IqamaInputScreen.notificationText.two")}
                {t("Onboarding.IqamaInputScreen.notificationText.three")}
              </InfoBox>
            ) : null}
            {errorMessages.map(err =>
              typeof err.message === "string" ? (
                <InfoBox variant="primary" borderPosition="start">
                  {t("Onboarding.IqamaInputScreen.notificationText.one")}
                  <Typography.Text color="neutralBase+30" size="caption1" weight="bold">
                    {t("Onboarding.IqamaInputScreen.notificationText.two")}
                  </Typography.Text>
                  {t("Onboarding.IqamaInputScreen.notificationText.three")}
                </InfoBox>
              ) : null
            )}
          </Stack>
        </View>
      </ContentContainer>
      <View style={submitButtonView}>
        <SubmitButton
          block
          control={control}
          onSubmit={handleSubmit(onSubmit)}
          testID="Onboarding.IqamaInputScreen:ContinueButton">
          {t("Onboarding.IqamaInputScreen.continue")}
        </SubmitButton>
        <View style={accountSignInStyle}>
          <Typography.Text size="callout" weight="regular">
            {t("Onboarding.IqamaInputScreen.subtext")}
          </Typography.Text>
          <Link onPress={onSignInPress} children={t("Onboarding.IqamaInputScreen.signIn")} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
