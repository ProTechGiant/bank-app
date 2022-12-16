import FormSubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
import SelectInput from "@/components/SelectInput";
import { Stack } from "@/components/Stack";
import { mockCroatiaPurpose } from "@/mocks/croatiaPurposeData";
import { mockExpectedAmount } from "@/mocks/expectedAmount";
import { mockOccuptions } from "@/mocks/occupationData";
import { mockSources } from "@/mocks/sourceOfIncomeData";
import useNavigation from "@/navigation/use-navigation";
import { Formik, FormikHelpers } from "formik";
import { View } from "react-native";
import { FinancialValidationSchema } from "./FinancialValidation";

type FormValues = {
  occupation: string;
  sourceOfIncome: string;
  purpose: string;
  expectedMovement: string;
};

const FinancialForm = () => {
  const navigation = useNavigation();

  const initialValues: FormValues = {
    occupation: "",
    purpose: "",
    sourceOfIncome: "",
    expectedMovement: "",
  };

  const submitHandler = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setTimeout(() => {
      setSubmitting(false);
      navigation.navigate("Onboarding.ForgeignTax");
    }, 500);
  };

  return (
    <View>
      <Formik initialValues={initialValues} validationSchema={FinancialValidationSchema} onSubmit={submitHandler}>
        <Stack space="large">
          <SelectInput
            name="occupation"
            title="Occupation"
            isOptional={true}
            helperText="We may have taken your latest occupation if it was registed on Absher, but you can change it here"
            label="Select your occupation"
            data={mockOccuptions}
          />
          <SelectInput
            name="purpose"
            title="What do you intend to use Croatia for?"
            label="Select at least one option"
            data={mockCroatiaPurpose}
          />
          <SelectInput
            name="sourceOfIncome"
            title="What your source of income?"
            label="Select at least one option"
            data={mockSources}
          />
          <SelectInput
            name="expectedMovement"
            title="What is the expected amount of deposits and withdrawals on a monthly basis?"
            label="Select an amount"
            data={mockExpectedAmount}
          />
          <View>
            <FormSubmitButton title="Continue" />
          </View>
        </Stack>
      </Formik>
    </View>
  );
};

export default FinancialForm;
