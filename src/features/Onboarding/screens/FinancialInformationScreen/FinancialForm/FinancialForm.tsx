import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import { Stack } from "@/components/Stack";
import { mockCroatiaPurpose } from "@/mocks/croatiaPurposeData";
import { mockExpectedAmount } from "@/mocks/expectedAmount";
import { mockOccuptions } from "@/mocks/occupationData";
import { mockSources } from "@/mocks/sourceOfIncomeData";
import useNavigation from "@/navigation/use-navigation";

import { FinancialValidationSchema } from "./FinancialValidation";

type FormValues = {
  occupation: string;
  sourceOfIncome: string;
  purpose: string;
  expectedMovement: string;
};

export default function FinancialForm() {
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(FinancialValidationSchema),
    mode: "onBlur",
  });

  const handleOnSubmit = (_values: FormValues) => {
    navigation.navigate("Onboarding.ForeignTax");
  };

  return (
    <View style={{ marginBottom: 55 }}>
      <Stack space="large">
        <DropdownInput
          control={control}
          name="occupation"
          label="Occupation"
          extra="Optional - We may have taken your latest occupation if it was registed on Absher, but you can change it here"
          placeholder="Select your occupation"
          options={mockOccuptions}
        />
        <DropdownInput
          control={control}
          name="purpose"
          label="What do you intend to use Croatia for?"
          placeholder="Select at least one option"
          options={mockCroatiaPurpose}
        />
        <DropdownInput
          control={control}
          name="sourceOfIncome"
          label="What your source of income?"
          placeholder="Select at least one option"
          options={mockSources}
        />
        <DropdownInput
          control={control}
          name="expectedMovement"
          label="What is the expected amount of deposits and withdrawals on a monthly basis?"
          placeholder="Select an amount"
          options={mockExpectedAmount}
        />
        <View>
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            Continue
          </SubmitButton>
        </View>
      </Stack>
    </View>
  );
}
