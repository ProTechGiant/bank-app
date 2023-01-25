import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
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
import { mockCroatiaPurpose } from "@/mocks/croatiaPurposeData";
import { mockExpectedAmount } from "@/mocks/expectedAmount";
import { mockOccuptions } from "@/mocks/occupationData";
import { mockSources } from "@/mocks/sourceOfIncomeData";
import useNavigation from "@/navigation/use-navigation";

import FinancialDetails from "./FinancialDetails";
import useSubmitFinancialDetails from "./use-submit-financial-details";

export default function FinancialInformationScreen() {
  const navigation = useNavigation();
  const submitFinancialDetailsAsync = useSubmitFinancialDetails();

  const { control, handleSubmit } = useForm<FinancialDetails>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  const handleOnSubmit = async (values: FinancialDetails) => {
    try {
      await submitFinancialDetailsAsync.mutateAsync(values);
      navigation.navigate("Onboarding.ForeignTax");
    } catch (error) {
      Alert.alert("Woops. Could not submit financial details");
      __DEV__ && console.error("Could not submit financial details: ", error);
    }
  };

  return (
    <Page>
      <NavHeader title="ABOUT YOU" backButton={true} barStyle="dark-content" rightComponent="close">
        <ProgressIndicator currentStep={3} totalStep={6} />
      </NavHeader>
      <ScrollView>
        <ContentContainer>
          <Stack align="stretch" direction="vertical" gap="large">
            <Typography.Text size="large" weight="bold">
              Tell us about your finances
            </Typography.Text>
            <MoreInfoDropdown title="Why are we asking this?">
              <Typography.Text color="neutralBase" size="footnote">
                This information is required to complete validation checks as part of joining Croatia. If this
                information changes later, you’ll be able to update it in the app.
              </Typography.Text>
            </MoreInfoDropdown>
            <DropdownInput
              control={control}
              name="OccupationCode"
              label="Occupation"
              extra="Optional - We may have taken your latest occupation if it was registed on Absher, but you can change it here"
              placeholder="Select your occupation"
              options={mockOccuptions}
            />
            <DropdownInput
              control={control}
              name="AccountPurpose"
              label="What do you intend to use Croatia for?"
              placeholder="Select at least one option"
              options={mockCroatiaPurpose}
            />
            <DropdownInput
              control={control}
              name="SourceOfIncome"
              label="What your source of income?"
              placeholder="Select at least one option"
              options={mockSources}
            />
            <DropdownInput
              control={control}
              name="MonthlyLimit"
              label="What is the expected amount of deposits and withdrawals on a monthly basis?"
              placeholder="Select an amount"
              options={mockExpectedAmount}
            />
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              Continue
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
