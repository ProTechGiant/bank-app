import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, View, ViewStyle } from "react-native";
import * as yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import CheckboxInput from "@/components/Form/CheckboxInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import TermsAndConditionDetails from "@/components/TermsAndConditionDetails";
import Typography from "@/components/Typography";
import { useContentTermsAndCondition } from "@/hooks/use-content";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { Term } from "../components";
import { useOnboardingBackButton } from "../hooks";
import { useConfirmTermsConditions } from "../hooks/query-hooks";

interface TermsAndConditionsForm {
  termAndConditionsAreCorrect: boolean;
  customerDeclarationAreCorrect: boolean;
}

const validationSchema = yup.object({
  termAndConditionsAreCorrect: yup.boolean().required().isTrue(),
  customerDeclarationAreCorrect: yup.boolean().required().isTrue(),
});

const TermsAndConditionsScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const termsConditionsAsync = useConfirmTermsConditions();
  const handleOnBackPress = useOnboardingBackButton();

  const termsAndConditionData = useContentTermsAndCondition();
  const termsSections = termsAndConditionData?.data?.TermsSections;

  const { control, handleSubmit } = useForm<TermsAndConditionsForm>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const handleOnSubmit = async () => {
    try {
      await termsConditionsAsync.mutateAsync();
      navigation.navigate("Onboarding.CreatePasscode");
    } catch (error: unknown) {
      const hasMessage = error?.errorContent?.Message;
      if (hasMessage) {
        Alert.alert(t(hasMessage));
      } else {
        Alert.alert(t("Onboarding.TermsAndConditions.errorText.alert"));
      }
      warn("onboarding", "Could not confirm terms and conditions: ", JSON.stringify(error));
    }
  };

  const dividerColor = useThemeStyles<string>(theme => theme.palette["neutralBase-10"]);

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
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
          <ContentContainer>
            <Stack direction="vertical" gap="32p" align="stretch">
              <Typography.Header size="large" weight="bold">
                {t("Onboarding.TermsAndConditions.title")}
              </Typography.Header>
              <Stack direction="vertical" gap="32p" align="stretch">
                <Term
                  title={t("Onboarding.TermsAndConditions.terms.sectionOne.title")}
                  desc={t("Onboarding.TermsAndConditions.terms.sectionOne.desc")}
                />
                <Term
                  title={t("Onboarding.TermsAndConditions.terms.sectionTwo.title")}
                  desc={t("Onboarding.TermsAndConditions.terms.sectionTwo.desc")}
                />
                <Term
                  title={t("Onboarding.TermsAndConditions.terms.sectionThree.title")}
                  desc={t("Onboarding.TermsAndConditions.terms.sectionThree.desc")}
                />
              </Stack>
              <View style={{ height: 1, backgroundColor: dividerColor }} />
              {termsSections === undefined ? (
                <FlexActivityIndicator />
              ) : (
                termsSections.map((term, index) => {
                  return (
                    <TermsAndConditionDetails
                      key={index}
                      title={term.Title}
                      data={term.Bodies}
                      typeOfTerms="onBoardingTerms"
                    />
                  );
                })
              )}
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
