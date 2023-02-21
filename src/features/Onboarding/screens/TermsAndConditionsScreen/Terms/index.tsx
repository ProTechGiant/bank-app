import { useTranslation } from "react-i18next";

import Stack from "@/components/Stack";

import Term from "./Term";

const Terms = () => {
  const { t } = useTranslation();

  return (
    <Stack direction="vertical" gap="32p" align="stretch">
      <Term
        title={t("Onboarding.TermsAndConditions.terms.sectionOne.title")}
        desc={t("Onboarding.TermsAndConditions.terms.sectionOne.desc")}
      />
      <Term
        title={t("Onboarding.TermsAndConditions.terms.sectionTwo.title")}
        desc={t("Onboarding.TermsAndConditions.terms.sectionTwo.desc")}
      />
      <Term
        title={t("Onboarding.TermsAndConditions.terms.sectionThree.title")}
        desc={t("Onboarding.TermsAndConditions.terms.sectionThree.desc")}
      />
    </Stack>
  );
};

export default Terms;
