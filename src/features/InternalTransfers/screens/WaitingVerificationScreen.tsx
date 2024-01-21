import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
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
import delayTransition from "@/utils/delay-transition";

import { useBeneficiaryBanks, useIVRValidations } from "../hooks/query-hooks";
import { IVREntryPoint } from "../types";

export default function WaitingVerificationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.WaitingVerificationScreen">>();

  const { transferAmount, reason, recipient, transferType, beneficiary, setBeneficiary } = useInternalTransferContext();
  const bankList = useBeneficiaryBanks();
  const { isError, isIdle, isSuccess, mutateAsync } = useIVRValidations(recipient.beneficiaryId ?? "");
  const timerRef = useRef(null);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchIVRStatus();
      handleTimeOut();
      return () => clearTimeout(timerRef.current);
    }, [])
  );

  useEffect(() => {
    setIsErrorModalVisible(isError);
  }, [isError]);

  const fetchIVRStatus = async () => {
    await mutateAsync();
  };

  const handleTimeOut = () => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (isIdle) {
        setIsErrorModalVisible(false);
        delayTransition(() => {
          if (route.params.navigationFlow === IVREntryPoint.TransferFlow) {
            navigation.replace("InternalTransfers.SendToBeneficiaryScreen");
          } else {
            navigation.navigate("InternalTransfers.BeneficiaryProfileScreen", {
              isIvrFailed: true,
            });
          }
        });
      }
    }, 60000);
  };

  const handleOnClose = () => {
    setIsErrorModalVisible(false);
    delayTransition(() => {
      if (route.params.navigationFlow === IVREntryPoint.TransferFlow) {
        navigation.replace("InternalTransfers.SendToBeneficiaryScreen");
      } else {
        navigation.navigate("InternalTransfers.BeneficiaryProfileScreen", {
          isIvrFailed: true,
        });
      }
    });
  };

  const handleOnNavigate = () => {
    if (transferAmount === undefined) {
      delayTransition(() => {
        if (route.params.navigationFlow === IVREntryPoint.TransferFlow) {
          navigation.replace("InternalTransfers.SendToBeneficiaryScreen");
        } else {
          setBeneficiary({ ...beneficiary, active: true });
          navigation.navigate("InternalTransfers.BeneficiaryProfileScreen", {
            isIvrFailed: true,
          });
        }
      });
    } else {
      if (
        transferType?.toString() === TransferType.CroatiaToArbTransferAction ||
        transferType?.toString() === TransferType.InternalTransferAction
      ) {
        return navigation.replace("InternalTransfers.ReviewTransferScreen");
      } else {
        const selectedBank = bankList.data?.Banks.find(item => item.EnglishName === recipient.bankName);
        return navigation.replace("InternalTransfers.ReviewLocalTransferScreen", {
          PaymentAmount: transferAmount,
          selectionType: "ips_local_Beneficiary",
          ReasonCode: reason,
          Beneficiary: {
            FullName: recipient.accountName,
            IBAN: recipient.iban,
            Bank: selectedBank,
            type: recipient.type,
            beneficiaryId: recipient.beneficiaryId ?? "",
          },
        });
      }
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
        isVisible={isErrorModalVisible}
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
