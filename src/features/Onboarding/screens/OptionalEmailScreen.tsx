import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useRegisterNotifications from "@/hooks/use-register-notifications";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useEmail } from "../hooks/query-hooks";

interface OptionalEmailFormValues {
  emailAddress: string | undefined;
}

export default function OptionalEmailScreen() {
  const { t } = useTranslation();

  const registerForNotifications = useRegisterNotifications();
  const { isLoading } = useOnboardingContext();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const emailAsync = useEmail();

  useEffect(() => {
    async function main() {
      await registerForNotifications.requestPermissions();
    }

    main();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    getValues,
  } = useForm<OptionalEmailFormValues>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      emailAddress: "",
    },
  });

  const emailValue = useWatch({ control, name: "emailAddress" });

  const handleOnSubmit = async (values: OptionalEmailFormValues) => {
    try {
      await emailAsync.mutateAsync(
        values.emailAddress ? (values.emailAddress.trim() ? values.emailAddress.trim() : undefined) : undefined
      );
      navigation.navigate("Onboarding.OccupationInfoScreen", { userName: "Ahmad" });
    } catch (error) {
      Alert.alert(t("Onboarding.OptionalEmailScreen.errorText.alert"));
      warn("onboarding", "Could not submit Email: ", JSON.stringify(error));
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const handleOnSkipPress = async () => {
    setValue("emailAddress", "");
    await handleSubmit(handleOnSubmit)();
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader title={<ProgressIndicator currentStep={2} totalStep={5} />} pageNumber="2/5" />

      {isLoading ? (
        <View style={styles.loading}>
          <FullScreenLoader />
        </View>
      ) : (
        <>
          <ContentContainer isScrollView>
            <Stack align="stretch" direction="vertical" gap="24p">
              <Stack direction="vertical" gap="8p">
                <Typography.Header size="large" weight="medium">
                  {t("Onboarding.OptionalEmailScreen.title")}
                </Typography.Header>
                <Typography.Text color="neutralBase+10" size="callout" weight="regular">
                  {t("Onboarding.OptionalEmailScreen.subHeader")}
                </Typography.Text>
              </Stack>
              <TextInput
                value={getValues("emailAddress")}
                onChangeText={value => setValue("emailAddress", value)}
                onClear={() => setValue("emailAddress", "")}
                autoCapitalize="none"
                autoCorrect={false}
                control={control}
                name="emailAddress"
                label={t("Onboarding.OptionalEmailScreen.inputEmailLabel")}
                placeholder={t("Onboarding.OptionalEmailScreen.inputEmailPlaceholder")}
                keyboardType="email-address"
                testID="Onboarding.OptionalEmailScreen:EmailInput"
              />
            </Stack>
          </ContentContainer>
          <View style={containerStyle}>
            <Stack align="stretch" direction="vertical" gap="8p">
              <SubmitButton
                control={control}
                onSubmit={handleSubmit(handleOnSubmit)}
                isDisabled={emailValue ? (emailValue.trim().length > 0 ? false : true) : true}
                testID="Onboarding.OptionalEmailScreen:ContinueButton">
                {t("Onboarding.OptionalEmailScreen.continue")}
              </SubmitButton>
              <Button
                loading={isSubmitting}
                onPress={handleOnSkipPress}
                variant="tertiary"
                testID="Onboarding.OptionalEmailScreen:SkipButton">
                {t("Onboarding.OptionalEmailScreen.skip")}
              </Button>
            </Stack>
          </View>
        </>
      )}
    </Page>
  );
}

const validationSchema = yup.object().shape({
  emailAddress: yup.string().optional().email("Please check your email address"),
});

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    marginTop: -68,
  },
});
