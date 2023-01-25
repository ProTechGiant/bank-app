import * as Yup from "yup";

import { nationalIdRegEx, saudiPhoneRegExp } from "@/utils";

export const iqamaValidationSchema = Yup.object().shape({
  MobileNumber: Yup.string().required("Mobile Required").matches(saudiPhoneRegExp, "Mobile number is not valid"),
  NationalId: Yup.string()
    .required("National ID/Iqama Number required")
    .matches(nationalIdRegEx, "Invalid Number")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),
});
