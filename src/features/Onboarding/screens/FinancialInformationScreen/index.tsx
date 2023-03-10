import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView } from "react-native";
import * as yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import MoreInfoDropdown from "@/features/Onboarding/components/MoreInfoDropdown";
import { warn } from "@/logger";
import { mockCroatiaPurpose } from "@/mocks/croatiaPurposeData";
import { mockExpectedAmount } from "@/mocks/expectedAmount";
import { mockOccuptions } from "@/mocks/occupationData";
import { mockSources } from "@/mocks/sourceOfIncomeData";
import useNavigation from "@/navigation/use-navigation";

import { useOnboardingBackButton } from "../../hooks/use-onboarding-back-button";
import FinancialDetails from "./FinancialDetails";
import useSubmitFinancialDetails from "./use-submit-financial-details";

export default function FinancialInformationScreen() {
  const navigation = useNavigation();
  const submitFinancialDetailsAsync = useSubmitFinancialDetails();
  const { t } = useTranslation();
  const handleOnBackPress = useOnboardingBackButton();

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
    <Page>
      <NavHeader
        onBackPress={handleOnBackPress}
        withBackButton={true}
        title={t("Onboarding.FinancialInformationScreen.navHeaderTitle")}>
        <ProgressIndicator currentStep={3} totalStep={6} />
      </NavHeader>
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
              options={mockOccuptions}
              buttonLabel={t("Onboarding.FinancialInformationScreen.inputSetLabel")}
              autoselect
            />
            <DropdownInput
              control={control}
              name="AccountPurpose"
              label={t("Onboarding.FinancialInformationScreen.inputAccountPurposeLabel")}
              placeholder={t("Onboarding.FinancialInformationScreen.inputAccountPurposePlaceholder")}
              options={mockCroatiaPurpose}
              buttonLabel={t("Onboarding.FinancialInformationScreen.inputSetLabel")}
              autoselect
            />
            <DropdownInput
              control={control}
              name="SourceOfIncome"
              label={t("Onboarding.FinancialInformationScreen.inputSourceOfIncomeLabel")}
              placeholder={t("Onboarding.FinancialInformationScreen.inputSourceOfIncomePlaceholder")}
              options={mockSources}
              buttonLabel={t("Onboarding.FinancialInformationScreen.inputSetLabel")}
              autoselect
            />
            <DropdownInput
              control={control}
              name="MonthlyLimit"
              label={t("Onboarding.FinancialInformationScreen.inputMonthlyLimitLabel")}
              placeholder={t("Onboarding.FinancialInformationScreen.inputMonthlyLimitPlaceholder")}
              options={mockExpectedAmount}
              buttonLabel={t("Onboarding.FinancialInformationScreen.inputSetLabel")}
              autoselect
            />
            <MoreInfoDropdown title={t("Onboarding.FinancialInformationScreen.moreInfoDropdownTitle")}>
              <Typography.Text color="neutralBase" size="footnote">
                {t("Onboarding.FinancialInformationScreen.moreInfoDropdownBody")}
              </Typography.Text>
            </MoreInfoDropdown>
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              {t("Onboarding.FinancialInformationScreen.continue")}
            </SubmitButton>
          </Stack>
        </ContentContainer>
      </ScrollView>
    </Page>
  );
}

const validationSchema = yup.object().shape({
  OccupationCode: yup.string(),
  AccountPurpose: yup.string().required("Intended use of Croatia required"),
  SourceOfIncome: yup.string().required("Source of income required"),
  MonthlyLimit: yup.string().required("Expected amount required"),
});
