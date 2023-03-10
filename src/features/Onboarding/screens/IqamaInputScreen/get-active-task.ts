export default function getActiveTask(activeTask: string) {
  const tasks: { [key: string]: string } = {
    MobileVerification: "Onboarding.Iqama",
    RetrievePersonalDetails: "Onboarding.ConfirmDetails",
    ConfirmPersonalDetails: "Onboarding.ConfirmDetails",
    PersistEmail: "Onboarding.OptionalEmail",
    PersistFinancialInfo: "Onboarding.Financial",
    "Fatca&Crs": "Onboarding.Fatca",
    "T&C": "Onboarding.TermsAndConditions",
    default: "Onboarding.Nafath",
  };
  return tasks[activeTask] || tasks["default"];
}
