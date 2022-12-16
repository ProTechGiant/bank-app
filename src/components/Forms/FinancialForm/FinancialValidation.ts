import * as Yup from "yup";

export const FinancialValidationSchema = Yup.object().shape({
  occupation: Yup.string(),
  purpose: Yup.string().required("Intended use of Croatia required"),
  sourceOfIncome: Yup.string().required("Source of income required"),
  expectedMovement: Yup.string().required("Expected amount required"),
});
