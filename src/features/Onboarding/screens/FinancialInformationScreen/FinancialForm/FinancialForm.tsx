import { Field, Formik, FormikHelpers } from "formik";
import { View } from "react-native";

import DropdownInput from "@/components/Form/DropdownInput";
import FormSubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
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
      navigation.navigate("Onboarding.ForeignTax");
    }, 500);
  };

  return (
    <View style={{ marginBottom: 55 }}>
      <Formik initialValues={initialValues} validationSchema={FinancialValidationSchema} onSubmit={submitHandler}>
        <Stack space="large">
          <Field
            component={DropdownInput}
            name="occupation"
            label="Occupation"
            extra="Optional - We may have taken your latest occupation if it was registed on Absher, but you can change it here"
            placeholder="Select your occupation"
            options={mockOccuptions}
          />
          <Field
            component={DropdownInput}
            name="purpose"
            label="What do you intend to use Croatia for?"
            placeholder="Select at least one option"
            options={mockCroatiaPurpose}
          />
          <Field
            component={DropdownInput}
            name="sourceOfIncome"
            label="What your source of income?"
            placeholder="Select at least one option"
            options={mockSources}
          />
          <Field
            component={DropdownInput}
            name="expectedMovement"
            label="What is the expected amount of deposits and withdrawals on a monthly basis?"
            placeholder="Select an amount"
            options={mockExpectedAmount}
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
