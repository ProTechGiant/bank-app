import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Share, { ShareOptions } from "react-native-share";

import { ShareIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { BillDetailsView } from "../components";
import { useBillPaymentHistoryDetail, useGetBillPaymentReceipt } from "../hooks/query-hooks";
import { SadadBillPaymentStackParams } from "../SadadBillPaymentStack";

export default function PaymentHistoryDetailScreen() {
  const { t, i18n } = useTranslation();
  const route = useRoute<RouteProp<SadadBillPaymentStackParams, "SadadBillPayments.PaymentHistoryDetailScreen">>();
  const navigation = useNavigation();
  const [isAPIErrorVisible, setIsAPIErrorVisible] = useState(false);

  const { status, data } = useBillPaymentHistoryDetail(route.params.PaymentId);
  const { mutateAsync } = useGetBillPaymentReceipt();

  const billDescription = i18n.language === "en" ? data?.BillDescriptionEn : data?.BillDescriptionAr;
  const billerDescription = i18n.language === "en" ? data?.BillerDescriptionEn : data?.BillerDescriptionAr;

  // showing error if api failed to get response.
  useEffect(() => {
    setIsAPIErrorVisible(status === "error" ? true : false);
  }, [status]);

  const handleOnSharePress = async () => {
    try {
      const res = await mutateAsync({ paymentID: route.params.PaymentId });
      const shareOptions: ShareOptions = {
        //TODO: change this implementation from base64 to file url when backend is ready.
        url: `data:application/pdf;base64,${res.PmtReceipt}`,
        filename: Platform.OS === "ios" ? `${data?.AccountNumber}.pdf` : `${data?.AccountNumber}`,
      };
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
        {data !== undefined ? (
          <>
            <NavHeader title={billDescription} />
            <ContentContainer>
              <Stack direction="vertical" justify="space-between" flex={1} style={styles.stackContainerStyle}>
                <BillDetailsView
                  {...data}
                  billDescription={billDescription ?? ""}
                  serviceType={billerDescription ?? ""}
                  billingAccount={data.AccountNumber}
                  billerID={data.BillerCode}
                  paidAmount={data.PaymentAmount}
                  billAmount={data.BillAmount}
                  paymentDate={data.PaymentDate}
                  billerLogoUrl={data.BillerLogoUrl}
                  referenceNumber={data.ReferenceNumber}
                  billAmountCurrency={data.BillAmountCurrency}
                />

                <Stack align="stretch" direction="vertical" style={buttonsContainerStyle}>
                  <Button variant="primary" iconLeft={<ShareIcon />} onPress={handleOnSharePress}>
                    {t("SadadBillPayments.PaymentHistoryDetailScreen.shareButton")}
                  </Button>
                </Stack>
              </Stack>
            </ContentContainer>
          </>
        ) : (
          <FullScreenLoader />
        )}
        <NotificationModal
          variant="error"
          buttons={{
            primary: (
              <Button
                onPress={() => {
                  setIsAPIErrorVisible(false);
                  navigation.goBack();
                }}>
                {t("SadadBillPayments.PaymentHistoryDetailScreen.errorModal.button")}
              </Button>
            ),
          }}
          message={t("SadadBillPayments.PaymentHistoryDetailScreen.errorModal.message")}
          title={t("SadadBillPayments.PaymentHistoryDetailScreen.errorModal.title")}
          isVisible={isAPIErrorVisible}
        />
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  stackContainerStyle: {
    alignItems: "center",
  },
});
