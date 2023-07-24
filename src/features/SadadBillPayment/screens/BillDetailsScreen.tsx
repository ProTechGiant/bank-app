import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native/types";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

import { BillDetailsView } from "../components";
import { billDetailsMock } from "../mocks/billDetailsMock";

export default function BillDetailsScreen() {
  const { t } = useTranslation();

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    width: "100%",
  }));

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader title={billDetailsMock.billDescription} />
        <ContentContainer>
          <Stack direction="vertical" justify="space-between" flex={1}>
            <BillDetailsView {...billDetailsMock} />
            <Stack align="stretch" direction="vertical" gap="4p" style={buttonsContainerStyle}>
              <Button variant="primary" disabled={billDetailsMock.paidAmount >= billDetailsMock.billAmount}>
                {t("SadadBillPayments.BillDetailsScreen.payBillButton")}
              </Button>
              <Button variant="tertiary">{t("SadadBillPayments.BillDetailsScreen.deleteBillButton")}</Button>
            </Stack>
          </Stack>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}
