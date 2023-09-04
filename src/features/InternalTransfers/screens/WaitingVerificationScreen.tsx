import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useNavigation from "@/navigation/use-navigation";

import { useBeneficiaryBanks, useIVRValidations } from "../hooks/query-hooks";
import { TransferType } from "../types";

export default function WaitingVerificationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { transferAmount, reason, recipient, transferType } = useInternalTransferContext();
  const bankList = useBeneficiaryBanks();
  const { isError, isIdle, isSuccess, mutateAsync } = useIVRValidations(recipient.beneficiaryId);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchIVRStatus();
    handleTimeOut();
    return () => clearTimeout(timerRef.current);
  }, []);

  const fetchIVRStatus = async () => {
    await mutateAsync();
  };

  const handleTimeOut = () => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (isIdle) {
        navigation.navigate("InternalTransfers.PaymentsHubScreen");
      }
    }, 10000);
  };

  const handleOnClose = () => {
    navigation.navigate("InternalTransfers.PaymentsHubScreen");
  };

  const handleOnNavigate = () => {
    if (transferType !== TransferType.SarieTransferAction) {
      return navigation.reset({
        index: 2,
        routes: [
          // adding the screens to stack for navigationBack and removing the IVR Validation screen
          { name: "InternalTransfers.PaymentsHubScreen" },
          { name: "InternalTransfers.InternalTransferScreen" },
          { name: "InternalTransfers.SendToBeneficiaryScreen" },
          { name: "InternalTransfers.ReviewTransferScreen" },
        ],
      });
    } else {
      const selectedBank = bankList.data?.Banks.find(item => item.EnglishName === recipient.bankName);
      if (
        transferAmount === undefined ||
        reason === undefined ||
        selectedBank === undefined ||
        recipient.accountName === undefined ||
        recipient.iban === undefined ||
        transferType === undefined
      ) {
        return;
      }
      return navigation.reset({
        index: 2,
        routes: [
          // adding the screens to stack for navigating back while removing the IVR Validation screen
          { name: "InternalTransfers.PaymentsHubScreen" },
          { name: "InternalTransfers.InternalTransferScreen" },
          { name: "InternalTransfers.SendToBeneficiaryScreen" },
          {
            name: "InternalTransfers.ReviewLocalTransferScreen",
            params: {
              PaymentAmount: transferAmount,
              ReasonCode: reason,
              Beneficiary: {
                FullName: recipient.accountName,
                IBAN: recipient.iban,
                Bank: selectedBank,
                Type: recipient.type,
              },
            },
          },
        ],
      });
    }
  };

  if (isSuccess) {
    handleOnNavigate();
  }

  return (
    <Page>
      <ContentContainer>
        <FullScreenLoader
          title={t("InternalTransfers.WaitingVerificationScreen.waitingVerification")}
          message={t("InternalTransfers.WaitingVerificationScreen.waitingMessage")}
        />
      </ContentContainer>
      <NotificationModal
        message={t("InternalTransfers.WaitingVerificationScreen.error.message")}
        isVisible={isError}
        title={t("InternalTransfers.WaitingVerificationScreen.error.title")}
        variant="error"
        buttons={{
          primary: (
            <Button onPress={handleOnClose}>{t("InternalTransfers.WaitingVerificationScreen.error.buttonText")}</Button>
          ),
        }}
      />
    </Page>
  );
}
