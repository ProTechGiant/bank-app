export default function getActiveTask(activeTask: string) {
  const tasks: { [key: string]: string } = {
    MobileVerification: "Onboarding.Iqama",
    RetrievePersonalDetails: "Onboarding.ConfirmDetails",
    ConfirmPersonalDetails: "Onboarding.ConfirmDetails",
    PersistEmail: "Onboarding.OptionalEmail",
    PersistFinancialInfo: "Onboarding.Financial",
    "Fatca&Crs": "Onboarding.Fatca",
    "T&C": "Onboarding.TermsAndConditions",
    WaitingEDDResult: "Onboarding.PendingAccount",
    RetryCustomerScreening: "Onboarding.PendingAccount",
    RetrieveValidationStatus: "Onboarding.PendingAccount",
    RetryAccountCreation: "Onboarding.PendingAccount",
    default: "Onboarding.Nafath",
  };
  return tasks[activeTask] || tasks["default"];
}
