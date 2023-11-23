import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useNavigation from "@/navigation/use-navigation";
import { TransferType } from "@/types/InternalTransfer";

import { useBeneficiaryBanks, useIVRValidations } from "../hooks/query-hooks";

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
        navigation.navigate("InternalTransfers.SendToBeneficiaryScreen");
      }
    }, 60000);
  };

  const handleOnClose = () => {
    navigation.navigate("InternalTransfers.SendToBeneficiaryScreen");
  };

  const handleOnNavigate = () => {
    if (transferType !== TransferType.SarieTransferAction) {
      return navigation.navigate("InternalTransfers.ReviewTransferScreen");
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
      return navigation.navigate("InternalTransfers.ReviewLocalTransferScreen", {
        PaymentAmount: transferAmount,
        ReasonCode: reason,
        Beneficiary: {
          FullName: recipient.accountName,
          IBAN: recipient.iban,
          Bank: selectedBank,
          type: recipient.type,
        },
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
