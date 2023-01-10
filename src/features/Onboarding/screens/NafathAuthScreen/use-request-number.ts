import { useMutation } from "react-query";

import api from "@/api";

interface OtpResponseType {
  LinkId: string;
  Otp: number;
}

export default function useRequestOtpNumber() {
  return useMutation(() => {
    return api<OtpResponseType>("api-dev", "v1", "customers/link", "POST", undefined, {
      NationalId: "1000012345", // TODO: this NationalId is probably dependent on the environment?
    });
  });
}
