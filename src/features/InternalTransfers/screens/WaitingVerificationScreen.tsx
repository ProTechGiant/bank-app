import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { TransferType } from "@/types/InternalTransfer";

import { useBeneficiaryBanks, useIVRValidations } from "../hooks/query-hooks";
import { IVREntryPoint } from "../types";

export default function WaitingVerificationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.WaitingVerificationScreen">>();


  const { transferAmount, reason, recipient, transferType } = useInternalTransferContext();
  const bankList = useBeneficiaryBanks();
  const { isError, isIdle, isSuccess, mutateAsync } = useIVRValidations(recipient.beneficiaryId);
  const timerRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      fetchIVRStatus();
      handleTimeOut();
      return () => clearTimeout(timerRef.current);
    }, [])
  );

  const fetchIVRStatus = async () => {
    await mutateAsync();
  };

  const handleTimeOut = () => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (isIdle) {
        if (route.params.navigationFlow === IVREntryPoint.TransferFlow) {
          navigation.navigate("InternalTransfers.SendToBeneficiaryScreen");
        } else {
          navigation.navigate("InternalTransfers.BeneficiaryProfileScreen", {
            isIvrFailed: true,
          });
        }
      }
    }, 60000);
  };

  const handleOnClose = () => {
    if (route.params.navigationFlow === IVREntryPoint.TransferFlow) {
      navigation.navigate("InternalTransfers.SendToBeneficiaryScreen");
    } else {
      navigation.navigate("InternalTransfers.BeneficiaryProfileScreen", {
        isIvrFailed: true,
      });
    }
  };

  const handleOnNavigate = () => {
    if (route.params.navigationFlow === IVREntryPoint.BeneficiaryFlow) {
      return navigation.navigate("InternalTransfers.BeneficiaryProfileScreen", {
        isIvrFailed: false,
      });
    }
    if (transferType?.toString() === TransferType.CroatiaToArbTransferAction || transferType?.toString() === TransferType.InternalTransferAction) {
   
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
        selectionType: "ips_local_Beneficiary",
        ReasonCode: reason,
        Beneficiary: {
          FullName: recipient.accountName,
          IBAN: recipient.iban,
          Bank: selectedBank,
          type: recipient.type,
          beneficiaryId: recipient.beneficiaryId,
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
