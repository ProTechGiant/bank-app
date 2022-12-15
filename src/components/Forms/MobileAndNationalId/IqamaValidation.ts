import * as Yup from "yup";
import { saudiPhoneRegExp } from "@/utils/strings";

export const iqamaValidationSchema = Yup.object().shape({
  mobileNumber: Yup.string().required("Mobile Required").matches(saudiPhoneRegExp, "Mobile number is not valid"),
  idNumber: Yup.string()
    .required("National ID/Iqama Number required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),
});
