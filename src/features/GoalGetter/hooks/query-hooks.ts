import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { DocumentResponse } from "../types";

const queryKeys = {
  all: () => ["termsAndConditions"],
};

export function useGetTermsAndConditions(documentId: string) {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.all(), () => {
    //TODO - change Api when TermsAndConditions will be ready
    return api<DocumentResponse>("v1", `adhoc-documents/${documentId}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language.toUpperCase(), //TODO - remove toUpperCase() when api ready
    });
  });
}
