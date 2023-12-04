import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";
import * as yup from "yup";

import Accordion from "@/components/Accordion";
import ContentContainer from "@/components/ContentContainer";
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
import { mockArbOccupations, mockEngOccupations } from "@/mocks/occupationData";
import { mockSources } from "@/mocks/sourceOfIncomeData";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

import { DropDownModal } from "../components";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useOnboardingBackButton } from "../hooks";
import { useSubmitFinancialDetails } from "../hooks/query-hooks";
import { FinancialDetails } from "../types";

export default function FinancialInformationScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const submitFinancialDetailsAsync = useSubmitFinancialDetails();
  const { t, i18n } = useTranslation();
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
        title={<ProgressIndicator currentStep={3} totalStep={5} />}
        pageNumber="3/5"
      />

      {isLoading ? (
        <View style={styles.loading}>
          <FullScreenLoader />
        </View>
      ) : (
        <ContentContainer isScrollView>
          <Stack align="stretch" direction="vertical" gap="24p">
            <Typography.Text size="large" weight="medium">
              {t("Onboarding.FinancialInformationScreen.title")}
            </Typography.Text>
            <DropDownModal
              control={control}
              name="OccupationCode"
              options={i18n.language.toUpperCase() === "EN" ? mockEngOccupations : mockArbOccupations}
              placeholder={t("Onboarding.FinancialInformationScreen.inputOccupationPlaceholder")}
              extra={t("Onboarding.FinancialInformationScreen.inputOccupationExtra")}
              label={t("Onboarding.FinancialInformationScreen.inputOccupationLabel")}
            />
            <DropDownModal
              control={control}
              name="AccountPurpose"
              options={mockCroatiaPurpose}
              placeholder={t("Onboarding.FinancialInformationScreen.inputAccountPurposePlaceholder")}
              label={t("Onboarding.FinancialInformationScreen.inputAccountPurposeLabel")}
            />
            <DropDownModal
              control={control}
              name="SourceOfIncome"
              options={mockSources}
              placeholder={t("Onboarding.FinancialInformationScreen.inputSourceOfIncomePlaceholder")}
              label={t("Onboarding.FinancialInformationScreen.inputSourceOfIncomeLabel")}
            />
            <DropDownModal
              control={control}
              name="MonthlyLimit"
              options={mockExpectedAmount}
              placeholder={t("Onboarding.FinancialInformationScreen.inputMonthlyLimitPlaceholder")}
              label={t("Onboarding.FinancialInformationScreen.inputMonthlyLimitLabel")}
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

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    marginTop: -68,
  },
});
