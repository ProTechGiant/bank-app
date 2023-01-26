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
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import useConfirmPersonalDetails from "./use-confirm-personal-details";

interface OptionalEmailFormValues {
  emailAddress: string | undefined;
}

export default function OptionalEmailScreen() {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing.regular,
      paddingHorizontal: theme.spacing.regular,
    }),
    []
  );
  const navigation = useNavigation();
  const confirmPersonalDetailsAsync = useConfirmPersonalDetails();

  const { control, handleSubmit } = useForm<OptionalEmailFormValues>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      emailAddress: undefined,
    },
  });

  const handleOnSubmit = async (values: OptionalEmailFormValues) => {
    try {
      await confirmPersonalDetailsAsync.mutateAsync(values.emailAddress);
      navigation.navigate("Onboarding.Financial");
    } catch (error) {
      Alert.alert(t("Onboarding.OptionalEmailScreen.errorText.alert"));
      __DEV__ && console.error("Could not confirm personal details: ", error);
    }
  };

  return (
    <Page>
      <NavHeader title={t("Onboarding.OptionalEmailScreen.navHeaderTitle")} backButton={true} rightComponent="close">
        <ProgressIndicator currentStep={2} totalStep={6} />
      </NavHeader>
      <ScrollView>
        <ContentContainer>
          <Stack align="stretch" direction="vertical" gap="large">
            <Typography.Header size="large" weight="bold">
              {t("Onboarding.OptionalEmailScreen.title")}
            </Typography.Header>
            <Typography.Text size="footnote" weight="regular">
              {t("Onboarding.OptionalEmailScreen.subHeader")}
            </Typography.Text>
            <TextInput
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
        <Stack align="stretch" direction="vertical" gap="small">
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            {t("Onboarding.OptionalEmailScreen.continue")}
          </SubmitButton>
          <Button onPress={handleSubmit(handleOnSubmit)} variant="secondary">
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
