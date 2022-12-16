import * as Yup from "yup";

export const stayUpdatedEmailValidationSchema = Yup.object().shape({
  emailAddress: Yup.string().email("Please check your email address"),
});
