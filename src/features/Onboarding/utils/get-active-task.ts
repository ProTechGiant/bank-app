export function getActiveTask(activeTask: string) {
  const tasks = {
    MobileVerification: "Onboarding.Iqama",
    RetrievePersonalDetails: "Onboarding.Nafath",
    GetTransactionId: "Onboarding.Nafath",
    ConfirmPersonalDetails: "Onboarding.ConfirmDetails",
    GenerateOTP: "Onboarding.OnboardingOtpScreen",
    "Resend&ValidateOTP": "Onboarding.OnboardingOtpScreen",
    PersistEmail: "Onboarding.OptionalEmail",
    PersistFinancialInfo: "Onboarding.OccupationInfoScreen",
    "Fatca&Crs": "Onboarding.Fatca",
    "T&C": "Onboarding.TermsAndConditions",
    WaitingEDDResult: "Onboarding.PendingAccount",
    RetryCustomerScreening: "Onboarding.PendingAccount",
    RetrieveValidationStatus: "Onboarding.SuccessScreen",
    RetryAccountCreation: "Onboarding.PendingAccount",
    CreatePasscode: "Onboarding.CreatePasscode",
    CheckCustomeredAgreedOnFOB: "Onboarding.FastOnboardingScreen",
    SelectARBMobileNumber: "Onboarding.UnmatchedArbNumberScreen",
    HighRiskCase: "Onboarding.HighRiskRequireDocumentScreen",
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore explicitly checked with `in` operator
  return activeTask in tasks ? tasks[activeTask] : "Onboarding.Iqama";
}
