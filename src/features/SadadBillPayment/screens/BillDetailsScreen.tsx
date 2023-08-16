import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { BillDetailsView } from "../components";
import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { SavedBillDetailsParams, useBillDetailsByBillId, useDeleteSavedBill } from "../hooks/query-hooks";
import { SadadBillPaymentStackParams } from "../SadadBillPaymentStack";

export default function BillDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<SadadBillPaymentStackParams, "SadadBillPayments.BillDetailsScreen">>();
  const { mutateAsync: deleteSavedBillAsync } = useDeleteSavedBill();
  const { data, status } = useBillDetailsByBillId(route.params.AccountNumber, route.params.billerId);

  const { setNavigationType, navigationType } = useSadadBillPaymentContext();

  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);
  const [isDeleteSuccessModalVisible, setIsDeleteSuccessModalVisible] = useState(false);
  const [isDeleteErrorModalVisible, setIsDeleteErrorModalVisible] = useState(false);
  const [isAPIErrorVisible, setIsAPIErrorVisible] = useState(false);

  // showing error if api failed to get response.
  useEffect(() => {
    setIsAPIErrorVisible(status === "error" ? true : false);
  }, [status]);

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    width: "100%",
  }));

  const handleOnBillDelete = async () => {
    if (data === undefined) return;
    setIsConfirmDeleteModalVisible(false);
    try {
      await deleteSavedBillAsync({
        billId: data.BillerId,
        accountNumber: data.BillingAccount,
      });
      setIsDeleteSuccessModalVisible(true);
    } catch (error) {
      setIsDeleteErrorModalVisible(true);
    }
  };

  const handleOnPayBillPress = () => {
    navigation.goBack();
    setNavigationType("payBill");
    navigation.navigate("SadadBillPayments.EnterBillAmountScreen");
  };

  const handleOnEditDescriptionPress = () => {
    const { BillCategory, BillId } = data as SavedBillDetailsParams;
    navigation.navigate("SadadBillPayments.EditBillDescriptionScreen", {
      billDescription: BillCategory,
      billId: BillId,
    });
  };

  return (
    <SafeAreaProvider>
      <Page>
        {data !== undefined ? (
          <>
            <NavHeader
              title={
                navigationType === "payBill"
                  ? t("SadadBillPayments.SelectBillerCategoryScreen.payBillTitle")
                  : data.BillCategory
              }
            />
            <ContentContainer>
              <Stack direction="vertical" justify="space-between" flex={1}>
                <BillDetailsView
                  onEditBillDescription={handleOnEditDescriptionPress}
                  billDescription={data.BillCategory}
                  serviceType={data.ServiceType}
                  billingAccount={data.BillingAccount}
                  billerID={data.BillerId}
                  paidAmount={data.PaidAmount}
                  billAmount={data.BillAmount}
                  paymentDate={data.DueDate}
                  billerLogoUrl={data.BillerLogo}
                  billAmountCurrency={data.BillAmountCurrency}
                />
                <Stack align="stretch" direction="vertical" gap="4p" style={buttonsContainerStyle}>
                  <Button
                    onPress={() => handleOnPayBillPress()}
                    variant="primary"
                    disabled={data.PaidAmount >= data.BillAmount}>
                    {t("SadadBillPayments.BillDetailsScreen.payBillButton")}
                  </Button>
                  <Button variant="tertiary" onPress={() => setIsConfirmDeleteModalVisible(true)}>
                    {t("SadadBillPayments.BillDetailsScreen.deleteBillButton")}
                  </Button>
                </Stack>
              </Stack>
            </ContentContainer>
          </>
        ) : (
          <FullScreenLoader />
        )}
      </Page>
      {/* Error modal incase of api fail */}
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
      {/* Delete confirmation modal */}
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button onPress={handleOnBillDelete}>
              {t("SadadBillPayments.BillDetailsScreen.deleteBill.deleteButton")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsConfirmDeleteModalVisible(false)}>
              {t("SadadBillPayments.BillDetailsScreen.deleteBill.cancelButton")}
            </Button>
          ),
        }}
        message={t("SadadBillPayments.BillDetailsScreen.deleteBill.message")}
        title={t("SadadBillPayments.BillDetailsScreen.deleteBill.title")}
        isVisible={isConfirmDeleteModalVisible}
        onClose={() => {
          setIsConfirmDeleteModalVisible(false);
        }}
      />
      {/* Delete success modal */}
      <NotificationModal
        variant="success"
        buttons={{
          primary: (
            <Button
              onPress={() => {
                setIsDeleteSuccessModalVisible(false);
                navigation.goBack();
              }}>
              {t("SadadBillPayments.BillDetailsScreen.deleteBill.okButtonText")}
            </Button>
          ),
        }}
        message={t("SadadBillPayments.BillDetailsScreen.deleteBill.deleteSuccess.message")}
        title={t("SadadBillPayments.BillDetailsScreen.deleteBill.deleteSuccess.title")}
        isVisible={isDeleteSuccessModalVisible}
      />
      {/* Delete error modal */}
      <NotificationModal
        variant="error"
        buttons={{
          primary: (
            <Button onPress={() => setIsDeleteErrorModalVisible(false)}>
              {t("SadadBillPayments.BillDetailsScreen.deleteBill.okButtonText")}
            </Button>
          ),
        }}
        message={t("SadadBillPayments.BillDetailsScreen.deleteBill.deleteError.message")}
        title={t("SadadBillPayments.BillDetailsScreen.deleteBill.deleteError.title")}
        isVisible={isDeleteErrorModalVisible}
      />
    </SafeAreaProvider>
  );
}
