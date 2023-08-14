import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { BillDetailsView } from "../components";
import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { useDeleteSavedBill } from "../hooks/query-hooks";
import { billDetailsMock } from "../mocks/billDetailsMock";

export default function BillDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutateAsync: deleteSavedBillAsync } = useDeleteSavedBill();
  const { setNavigationType, navigationType } = useSadadBillPaymentContext();

  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);
  const [isDeleteSuccessModalVisible, setIsDeleteSuccessModalVisible] = useState(false);
  const [isDeleteErrorModalVisible, setIsDeleteErrorModalVisible] = useState(false);

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    width: "100%",
  }));

  const handleOnBillDelete = async () => {
    setIsConfirmDeleteModalVisible(false);
    try {
      await deleteSavedBillAsync({ billId: billDetailsMock.billId, accountNumber: billDetailsMock.billingAccount });
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
    const { billDescription, billId } = billDetailsMock;
    navigation.navigate("SadadBillPayments.EditBillDescriptionScreen", {
      billDescription: billDescription,
      billId: billId,
    });
  };

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader
          title={
            navigationType === "payBill"
              ? t("SadadBillPayments.SelectBillerCategoryScreen.payBillTitle")
              : billDetailsMock.billDescription
          }
        />
        <ContentContainer>
          <Stack direction="vertical" justify="space-between" flex={1}>
            <BillDetailsView onEditBillDescription={handleOnEditDescriptionPress} {...billDetailsMock} />
            <Stack align="stretch" direction="vertical" gap="4p" style={buttonsContainerStyle}>
              <Button
                onPress={() => handleOnPayBillPress()}
                variant="primary"
                disabled={billDetailsMock.paidAmount >= billDetailsMock.billAmount}>
                {t("SadadBillPayments.BillDetailsScreen.payBillButton")}
              </Button>
              <Button variant="tertiary" onPress={() => setIsConfirmDeleteModalVisible(true)}>
                {t("SadadBillPayments.BillDetailsScreen.deleteBillButton")}
              </Button>
            </Stack>
          </Stack>
        </ContentContainer>
      </Page>
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
