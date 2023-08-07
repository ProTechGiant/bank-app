import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native/types";
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
import { billDetailsMock } from "../mocks/billDetailsMock";

export default function BillDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setNavigationType } = useSadadBillPaymentContext();

  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);
  const [isDeleteSuccessModalVisible, setIsDeleteSuccessModalVisible] = useState(false);
  const [isDeleteErrorModalVisible, setIsDeleteErrorModalVisible] = useState(false);

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    width: "100%",
  }));

  const handleOnBillDelete = () => {
    setIsConfirmDeleteModalVisible(false);
    try {
      // TODO: this timeout is here just to mimic api call behavior. It will be replaced with API call in future.
      setTimeout(() => {
        setIsDeleteSuccessModalVisible(true);
      }, 1000);
    } catch (error) {
      setIsDeleteErrorModalVisible(true);
    }
  };

  const handleOnPayBillPress = () => {
    navigation.goBack();
    setNavigationType("payBill");
    navigation.navigate("SadadBillPayments.EnterBillAmountScreen");
  };

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader title={billDetailsMock.billDescription} />
        <ContentContainer>
          <Stack direction="vertical" justify="space-between" flex={1}>
            <BillDetailsView {...billDetailsMock} />
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
            <Button onPress={() => setIsDeleteSuccessModalVisible(false)}>
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
