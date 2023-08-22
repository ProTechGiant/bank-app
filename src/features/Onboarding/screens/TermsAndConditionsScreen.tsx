import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, View, ViewStyle } from "react-native";
import * as yup from "yup";

import ApiError from "@/api/ApiError";
import ResponseError from "@/api/ResponseError";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
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
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
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
  const navigation = useNavigation<UnAuthenticatedStackParams>();
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
    } catch (error) {
      const hasMessage = (error as ApiError<ResponseError>)?.errorContent?.Message;

      if (hasMessage) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore need to sort this out?
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
    <Page>
      <NavHeader
        onBackPress={handleOnBackPress}
        title={t("Onboarding.TermsAndConditions.navHeaderTitle")}
        withBackButton={true}
        testID="Onboarding.TermsAndConditionsScreen:NavHeader">
        <ProgressIndicator currentStep={5} totalStep={6} />
      </NavHeader>
      <ContentContainer isScrollView>
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
          <Divider color={dividerColor} height={1} />
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
      <View style={footerStyle}>
        <Stack align="stretch" gap="8p" direction="vertical">
          <View />
          <CheckboxInput
            control={control}
            isEditable={true}
            name="termAndConditionsAreCorrect"
            label={t("Onboarding.TermsAndConditions.checkBoxTermsLabel")}
            testID="Onboarding.TermsAndConditionsScreen:TermsAreCorrectInput"
          />
          <CheckboxInput
            control={control}
            isEditable={true}
            name="customerDeclarationAreCorrect"
            label={t("Onboarding.TermsAndConditions.checkBoxDeclarationLabel")}
            testID="Onboarding.TermsAndConditionsScreen:CustomerDeclarationAreCorrectInput"
          />
          <SubmitButton
            control={control}
            onSubmit={handleSubmit(handleOnSubmit)}
            testID="Onboarding.TermsAndConditionsScreen:ContinueButton">
            {t("Onboarding.TermsAndConditions.continue")}
          </SubmitButton>
        </Stack>
      </View>
    </Page>
  );
};

export default TermsAndConditionsScreen;
