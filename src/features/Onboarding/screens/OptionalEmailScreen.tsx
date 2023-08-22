import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, View, ViewStyle } from "react-native";
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
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import notifications from "@/utils/push-notifications";

import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useEmail } from "../hooks/query-hooks";

interface OptionalEmailFormValues {
  emailAddress: string | undefined;
}

export default function OptionalEmailScreen() {
  const { t } = useTranslation();
  const { mobileNumber, isLoading } = useOnboardingContext();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const emailAsync = useEmail();

  useEffect(() => {
    async function main() {
      try {
        const status = await notifications.requestPermissions();
        if (status) {
          await notifications.registerForNotifications();
          if (mobileNumber !== undefined) await notifications.registerWithT2(mobileNumber);
        }
      } catch (error) {
        Alert.alert(t("Onboarding.OptionalEmailScreen.errorText.notificationRegistrationFailure"));
      }
    }
    main();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<OptionalEmailFormValues>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      emailAddress: undefined,
    },
  });

  const handleOnSubmit = async (values: OptionalEmailFormValues) => {
    try {
      await emailAsync.mutateAsync(values.emailAddress);
      navigation.navigate("Onboarding.Financial");
    } catch (error) {
      Alert.alert(t("Onboarding.OptionalEmailScreen.errorText.alert"));
      warn("onboarding", "Could not submit Email: ", JSON.stringify(error));
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={false}
        title={t("Onboarding.OptionalEmailScreen.navHeaderTitle")}
        testID="Onboarding.OptionalEmailScreen:NavHeader">
        <ProgressIndicator currentStep={2} totalStep={6} />
      </NavHeader>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <ContentContainer isScrollView>
            <Stack align="stretch" direction="vertical" gap="24p">
              <Typography.Header size="large" weight="bold">
                {t("Onboarding.OptionalEmailScreen.title")}
              </Typography.Header>
              <Typography.Text size="footnote" weight="regular">
                {t("Onboarding.OptionalEmailScreen.subHeader")}
              </Typography.Text>
              <TextInput
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
                testID="Onboarding.OptionalEmailScreen:ContinueButton">
                {t("Onboarding.OptionalEmailScreen.continue")}
              </SubmitButton>
              <Button
                loading={isSubmitting}
                onPress={handleSubmit(handleOnSubmit)}
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
