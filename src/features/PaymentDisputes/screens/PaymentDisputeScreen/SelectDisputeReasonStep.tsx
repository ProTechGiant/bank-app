import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

import { DisputeReasonsList } from "../../components";
import { useReasons } from "../../hooks/query-hooks";
import { TransactionType } from "../../types";

interface SelectDisputeReasonStepProps {
  transactionType: TransactionType;
  onBack: () => void;
  onSelectReason: (code: string) => void;
}

export default function SelectDisputeReasonStep({
  transactionType,
  onBack,
  onSelectReason,
}: SelectDisputeReasonStepProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { data, isError } = useReasons(transactionType);
  const [isCancelDisputeModalVisible, setIsCancelDisputeModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const handleOnOpenConfirmCancelDispute = () => {
    setIsCancelDisputeModalVisible(true);
  };

  const handleOnConfirmCancelDispute = () => {
    setIsCancelDisputeModalVisible(false);
    setTimeout(() => {
      navigation.navigate("Temporary.LandingScreen");
    }, 300);
  };

  const handleOnCloseConfirmCancelDispute = () => {
    setIsCancelDisputeModalVisible(false);
  };

  const handleOnCloseErrorModal = () => {
    setIsErrorModalVisible(false);
    onBack();
  };

  const handleOnPressReason = (disputeReasonsCode: string) => {
    onSelectReason(disputeReasonsCode);
  };

  useEffect(() => {
    if (isError) {
      setIsErrorModalVisible(true);
    }
  }, [isError]);

  return (
    <>
      <NavHeader
        withBackButton
        onBackPress={onBack}
        end={<NavHeader.CloseEndButton onPress={handleOnOpenConfirmCancelDispute} />}
      />
      {data !== undefined ? (
        <ContentContainer isScrollView>
          <Stack direction="vertical" gap="48p" align="stretch" flex={1}>
            <Typography.Text size="title1" weight="medium">
              {t("PaymentDisputes.SelectDisputeReasonModal.title")}
            </Typography.Text>
            <DisputeReasonsList data={data.PaymentCaseCategories} onPress={handleOnPressReason} />
          </Stack>
        </ContentContainer>
      ) : (
        <FlexActivityIndicator />
      )}
      <NotificationModal
        variant="error"
        buttons={{
          primary: (
            <Button onPress={handleOnCloseErrorModal}>
              {t("PaymentDisputes.SelectDisputeReasonModal.errorModal.buttonText")}
            </Button>
          ),
        }}
        message={t("PaymentDisputes.SelectDisputeReasonModal.errorModal.message")}
        title={t("PaymentDisputes.SelectDisputeReasonModal.errorModal.title")}
        isVisible={isErrorModalVisible}
      />
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button onPress={handleOnConfirmCancelDispute}>{t("PaymentDisputes.CancelDisputeModal.exitButton")}</Button>
          ),
          secondary: (
            <Button onPress={handleOnCloseConfirmCancelDispute}>
              {t("PaymentDisputes.CancelDisputeModal.continueDisputeButton")}
            </Button>
          ),
        }}
        message={t("PaymentDisputes.CancelDisputeModal.message")}
        title={t("PaymentDisputes.CancelDisputeModal.title")}
        isVisible={isCancelDisputeModalVisible}
      />
    </>
  );
}
