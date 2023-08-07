import { useTranslation } from "react-i18next";
import { Platform, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Share, { ShareOptions } from "react-native-share";

import { ShareIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import { BillDetailsView } from "../components";
import { billPaymentPDFMock } from "../mocks/billPaymentPDFMock";
import { paymentHistoryDetailMock } from "../mocks/paymentHistoryDetailMock";

export default function PaymentHistoryDetailScreen() {
  const { t } = useTranslation();

  const handleOnSharePress = async () => {
    //TODO: replace this mock data with data from API
    const { data, fileName, fileNameWithoutExtension } = billPaymentPDFMock;
    const shareOptions: ShareOptions =
      Platform.OS === "ios"
        ? {
            url: data,
            filename: fileName,
          }
        : {
            url: data,
            filename: fileNameWithoutExtension,
          };
    try {
      await Share.open(shareOptions);
    } catch (error) {
      warn("Cannot share payment receipt: ", JSON.stringify(error));
    }
  };

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    width: "100%",
  }));

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader title={paymentHistoryDetailMock.billDescription} />
        <ContentContainer>
          <Stack direction="vertical" justify="space-between" flex={1}>
            <BillDetailsView
              {...paymentHistoryDetailMock}
              dueDate={paymentHistoryDetailMock.billDate}
              billingAccount={paymentHistoryDetailMock.accountNumber}
              billerID={paymentHistoryDetailMock.billNumber}
            />
            <Stack align="stretch" direction="vertical" style={buttonsContainerStyle}>
              <Button variant="primary" iconLeft={<ShareIcon />} onPress={handleOnSharePress}>
                {t("SadadBillPayments.PaymentHistoryDetailScreen.shareButton")}
              </Button>
            </Stack>
          </Stack>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}
