import { useTranslation } from "react-i18next";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";

export default function BillPaymentHomeScreen() {
  const { t } = useTranslation();

  return (
    <Page>
      <NavHeader title={t("SadadBillPayments.BillPaymentHomeScreen.navHeaderTitle")} />
    </Page>
  );
}
