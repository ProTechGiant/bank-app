import { useMutation } from "react-query";

import api from "@/api";

interface OtpResponseType {
  LinkId: string;
  Otp: number;
}

interface OtpResponseError {
  Message: string;
  Errors: Array<{ Message: string; Path: string }>;
}

export default function useRequestOtpNumber() {
  return useMutation(() => {
    return api<OtpResponseType, OtpResponseError>("alpha-nafath-adapter", "v1", "customers/link", "POST", undefined, {
      NationalId: "1000012345", // TODO: this NationalId is probably dependent on the environment?
    });
  });
}
