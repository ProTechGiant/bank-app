import { HighRiskCaseStatus } from "../constants";

export function getHighRiskCaseStatusScreen(highRiskCaseStatus: string) {
  const statusScreenMapper = {
    [HighRiskCaseStatus.DOCUMENTS_REQUIRED]: "Onboarding.UploadDocumentScreen",
    [HighRiskCaseStatus.DOCUMENTS_RETURNED]: "Onboarding.HighRiskRequireDocumentScreen",
    [HighRiskCaseStatus.DOCUMENTS_UPLOADED]: "Onboarding.VerifyingInformationScreen",
    [HighRiskCaseStatus.NEW]: "Onboarding.HighRiskRequireDocumentScreen",
  };
  return highRiskCaseStatus in statusScreenMapper
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore explicitly checked with `in` operator
      statusScreenMapper[highRiskCaseStatus]
    : "Onboarding.HighRiskRequireDocumentScreen";
}
