import * as Yup from "yup";

import { numericRegExp, saudiPhoneRegExp } from "@/utils";

export const iqamaValidationSchema = Yup.object().shape({
  MobileNumber: Yup.string().required("Mobile Required").matches(saudiPhoneRegExp, "Mobile number is not valid"),
  NationalId: Yup.string()
    .required("National ID/Iqama Number required")
    .matches(numericRegExp, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),
});
