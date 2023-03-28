import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, View, ViewStyle } from "react-native";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useEmail } from "../hooks/query-hooks";

interface OptionalEmailFormValues {
  emailAddress: string | undefined;
}

export default function OptionalEmailScreen() {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing["20p"],
      paddingHorizontal: theme.spacing["20p"],
    }),
    []
  );
  const navigation = useNavigation();
  const emailAsync = useEmail();

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

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={false} title={t("Onboarding.OptionalEmailScreen.navHeaderTitle")}>
        <ProgressIndicator currentStep={2} totalStep={6} />
      </NavHeader>
      <ScrollView>
        <ContentContainer>
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
            />
          </Stack>
        </ContentContainer>
      </ScrollView>
      <View style={containerStyle}>
        <Stack align="stretch" direction="vertical" gap="8p">
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            {t("Onboarding.OptionalEmailScreen.continue")}
          </SubmitButton>
          <Button loading={isSubmitting} onPress={handleSubmit(handleOnSubmit)} variant="tertiary">
            {t("Onboarding.OptionalEmailScreen.skip")}
          </Button>
        </Stack>
      </View>
    </Page>
  );
}

const validationSchema = yup.object().shape({
  emailAddress: yup.string().optional().email("Please check your email address"),
});
