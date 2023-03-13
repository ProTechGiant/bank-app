import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, View, ViewStyle } from "react-native";
import * as yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import CheckboxInput from "@/components/Form/CheckboxInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useOnboardingBackButton } from "../../hooks/use-onboarding-back-button";
import Declaration from "./Declaration";
import Terms from "./Terms";
import useTermsConditions from "./use-terms-conditions";

interface TermsAndConditionsForm {
  termAndConditionsAreCorrect: boolean;
  customerDeclarationAreCorrect: boolean;
}

const validationSchema = yup.object({
  termAndConditionsAreCorrect: yup.boolean().isTrue(),
  customerDeclarationAreCorrect: yup.boolean().isTrue(),
});

const TermsAndConditionsScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const termsConditionsAsync = useTermsConditions();
  const handleOnBackPress = useOnboardingBackButton();

  const { control, handleSubmit } = useForm<TermsAndConditionsForm>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const handleOnSubmit = async () => {
    try {
      await termsConditionsAsync.mutateAsync();
      navigation.navigate("Onboarding.PendingAccount");
    } catch (error) {
      Alert.alert(t("Onboarding.TermsAndConditions.errorText.alert"));
      warn("onboarding", "Could not confirm terms and conditions: ", JSON.stringify(error));
    }
  };

  const dividerColor = useThemeStyles<string>(theme => theme.palette["neutralBase-10"]);

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: theme.spacing["32p"],
  }));

  return (
    <>
      <Page insets={["top"]}>
        <NavHeader
          onBackPress={handleOnBackPress}
          title={t("Onboarding.TermsAndConditions.navHeaderTitle")}
          withBackButton={true}>
          <ProgressIndicator currentStep={5} totalStep={6} />
        </NavHeader>
        <ScrollView>
          <ContentContainer style={{ marginBottom: 64 }}>
            <Stack direction="vertical" gap="32p" align="stretch">
              <Typography.Header size="large" weight="bold">
                {t("Onboarding.TermsAndConditions.title")}
              </Typography.Header>
              <Terms />
              <View style={{ height: 1, backgroundColor: dividerColor }} />
              <Declaration />
            </Stack>
          </ContentContainer>
        </ScrollView>
        <View style={footerStyle}>
          <Stack align="stretch" gap="8p" direction="vertical">
            <View />
            <CheckboxInput
              control={control}
              isEditable={true}
              name="termAndConditionsAreCorrect"
              label={t("Onboarding.TermsAndConditions.checkBoxTermsLabel")}
            />
            <CheckboxInput
              control={control}
              isEditable={true}
              name="customerDeclarationAreCorrect"
              label={t("Onboarding.TermsAndConditions.checkBoxDeclarationLabel")}
            />
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              {t("Onboarding.TermsAndConditions.continue")}
            </SubmitButton>
          </Stack>
        </View>
      </Page>
    </>
  );
};

export default TermsAndConditionsScreen;
