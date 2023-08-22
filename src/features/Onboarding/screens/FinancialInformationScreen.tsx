import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView } from "react-native";
import * as yup from "yup";

import Accordion from "@/components/Accordion";
import ContentContainer from "@/components/ContentContainer";
import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import { mockCroatiaPurpose } from "@/mocks/croatiaPurposeData";
import { mockExpectedAmount } from "@/mocks/expectedAmount";
import { mockOccupations } from "@/mocks/occupationData";
import { mockSources } from "@/mocks/sourceOfIncomeData";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useOnboardingBackButton } from "../hooks";
import { useSubmitFinancialDetails } from "../hooks/query-hooks";
import { FinancialDetails } from "../types";

export default function FinancialInformationScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const submitFinancialDetailsAsync = useSubmitFinancialDetails();
  const { t } = useTranslation();
  const handleOnBackPress = useOnboardingBackButton();
  const { isLoading } = useOnboardingContext();

  const { control, handleSubmit } = useForm<FinancialDetails>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  const handleOnSubmit = async (values: FinancialDetails) => {
    try {
      await submitFinancialDetailsAsync.mutateAsync(values);
      navigation.navigate("Onboarding.Fatca");
    } catch (error) {
      Alert.alert(t("Onboarding.FinancialInformationScreen.errorText.alert"));
      warn("onboarding", `Could not submit financial details: ${(error as Error).message}`);
    }
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        onBackPress={handleOnBackPress}
        withBackButton={true}
        title={t("Onboarding.FinancialInformationScreen.navHeaderTitle")}
        testID="Onboarding.FinancialInformationScreen:NavHeader">
        <ProgressIndicator currentStep={3} totalStep={6} />
      </NavHeader>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <ScrollView>
          <ContentContainer>
            <Stack align="stretch" direction="vertical" gap="24p">
              <Typography.Text size="large" weight="bold">
                {t("Onboarding.FinancialInformationScreen.title")}
              </Typography.Text>
              <DropdownInput
                control={control}
                name="OccupationCode"
                label={t("Onboarding.FinancialInformationScreen.inputOccupationLabel")}
                extra={t("Onboarding.FinancialInformationScreen.inputOccupationExtra")}
                placeholder={t("Onboarding.FinancialInformationScreen.inputOccupationPlaceholder")}
                options={mockOccupations}
                buttonLabel={t("Onboarding.FinancialInformationScreen.inputSetLabel")}
                variant="small"
                autoselect
                testID="Onboarding.FinancialInformationScreen:OccupationCodeInput"
              />
              <DropdownInput
                control={control}
                name="AccountPurpose"
                label={t("Onboarding.FinancialInformationScreen.inputAccountPurposeLabel")}
                placeholder={t("Onboarding.FinancialInformationScreen.inputAccountPurposePlaceholder")}
                options={mockCroatiaPurpose}
                buttonLabel={t("Onboarding.FinancialInformationScreen.inputSetLabel")}
                variant="small"
                autoselect
                testID="Onboarding.FinancialInformationScreen:AccountPurposeInput"
              />
              <DropdownInput
                control={control}
                name="SourceOfIncome"
                label={t("Onboarding.FinancialInformationScreen.inputSourceOfIncomeLabel")}
                placeholder={t("Onboarding.FinancialInformationScreen.inputSourceOfIncomePlaceholder")}
                options={mockSources}
                buttonLabel={t("Onboarding.FinancialInformationScreen.inputSetLabel")}
                variant="small"
                autoselect
                testID="Onboarding.FinancialInformationScreen:SourceOfIncomeInput"
              />
              <DropdownInput
                control={control}
                name="MonthlyLimit"
                label={t("Onboarding.FinancialInformationScreen.inputMonthlyLimitLabel")}
                placeholder={t("Onboarding.FinancialInformationScreen.inputMonthlyLimitPlaceholder")}
                options={mockExpectedAmount}
                buttonLabel={t("Onboarding.FinancialInformationScreen.inputSetLabel")}
                variant="small"
                autoselect
                testID="Onboarding.FinancialInformationScreen:MonthlyLimitInput"
              />
              <Accordion title={t("Onboarding.FinancialInformationScreen.moreInfoDropdownTitle")}>
                <Typography.Text color="neutralBase+10" size="footnote">
                  {t("Onboarding.FinancialInformationScreen.moreInfoDropdownBody")}
                </Typography.Text>
              </Accordion>
              <SubmitButton
                control={control}
                onSubmit={handleSubmit(handleOnSubmit)}
                testID="Onboarding.FinancialInformationScreen:ContinueButton">
                {t("Onboarding.FinancialInformationScreen.continue")}
              </SubmitButton>
            </Stack>
          </ContentContainer>
        </ScrollView>
      )}
    </Page>
  );
}

const validationSchema = yup.object().shape({
  OccupationCode: yup.string(),
  AccountPurpose: yup.string().required("Intended use of Croatia required"),
  SourceOfIncome: yup.string().required("Source of income required"),
  MonthlyLimit: yup.string().required("Expected amount required"),
});
