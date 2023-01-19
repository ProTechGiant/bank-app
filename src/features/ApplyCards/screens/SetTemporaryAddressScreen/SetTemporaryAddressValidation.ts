import * as Yup from "yup";

import { alphaNumericSpecialCharsRegExp } from "@/utils";

export const SetTemporaryAddressValidationSchema = Yup.object({
  addressLineOne: Yup.string()
    .required("Address line 1 is required")
    .matches(alphaNumericSpecialCharsRegExp, "Address line 1 is not valid")
    .min(5, "Minimum 5 characters")
    .max(100, "Maximum 100 characters"),
  addressLineTwo: Yup.string().max(100, "Maximum 100 characters"),
  district: Yup.string().required("District is required"),
  city: Yup.string().required("City is required"),
  postalCode: Yup.string()
    .required("Postal code is required")
    .min(5, "Postal code is not valid")
    .max(5, "Postal code is not valid"),
});
