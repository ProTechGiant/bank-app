import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

import { DisputeReasonsList } from "../components";
import { DisputeReasonType } from "../types";

const mockDisputesReasons: DisputeReasonType[] = [
  {
    text: "Duplicate bill - I was charged more than once for a single transaction.",
    link: "duplicate-bill",
  },
  {
    text: "Didn't get goods or service - I didn’t receive the goods or service I paid for.",
    link: "didnt-get-goods-or-service",
  },
  {
    text: "Paid in a different way - I’ve already paid with cash, cheque or another type of credit.",
    link: "paid-in-a-different-way",
  },
  {
    text: "Wrong amount - The payment is different to the amount I authorised.",
    link: "wrong-amount",
  },
  {
    text: "Cancelled subscription - I’ve already cancelled this subscription or membership.",
    link: "cancelled-subscription",
  },
  {
    text: "Not refunded - I’ve been refunded and have a receipt but haven’t had the refund.",
    link: "not-refunded",
  },
  {
    text: "Hotel cancellation - This is a hotel booking that’s been cancelled.",
    link: "hotel-cancellation",
  },
  {
    text: "I need a copy of the receipt - You may need to pay additional charges to do this.",
    link: "i-need-a-copy-of-the-receipt",
  },
  {
    text: "Too many transactions - I only authorised one transaction at this merchant.",
    link: "too-many-transactions",
  },
  {
    text: "Something else",
    link: "something-else",
  },
];

export default function DisputesReasonsModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
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

  // TODO: add a useEffect check when backend is ready
  // const handleOnOpenErrorModal = () => {
  //   setIsErrorModalVisible(true);
  // };

  const handleOnCloseErrorModal = () => {
    setIsErrorModalVisible(false);
    setTimeout(() => {
      navigation.navigate("Temporary.LandingScreen");
    }, 300);
  };

  const handleOnPressDisputeDetails = () => {
    navigation.navigate("PaymentDisputes.DisputeDetailsModal");
  };

  return (
    <>
      <Page>
        <NavHeader withBackButton end={<NavHeader.CloseEndButton onPress={handleOnOpenConfirmCancelDispute} />} />
        <ContentContainer isScrollView>
          <Stack direction="vertical" gap="48p" align="stretch" flex={1}>
            <Typography.Text size="title1" weight="medium">
              {t("PaymentDisputes.DisputeReasonsModal.title")}
            </Typography.Text>
            {mockDisputesReasons ? (
              <DisputeReasonsList data={mockDisputesReasons} onPressDisputeDetails={handleOnPressDisputeDetails} />
            ) : null}
          </Stack>
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="error"
        buttons={{
          primary: (
            <Button onPress={handleOnCloseErrorModal}>
              {t("PaymentDisputes.DisputeReasonsModal.errorModal.buttonText")}
            </Button>
          ),
        }}
        message={t("PaymentDisputes.DisputeReasonsModal.errorModal.message")}
        title={t("PaymentDisputes.DisputeReasonsModal.errorModal.title")}
        isVisible={isErrorModalVisible}
      />
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button onPress={handleOnConfirmCancelDispute}>
              {t("PaymentDisputes.DisputeReasonsModal.CancelDisputeModal.primaryButtonText")}
            </Button>
          ),
          secondary: (
            <Button onPress={handleOnCloseConfirmCancelDispute}>
              {t("PaymentDisputes.DisputeReasonsModal.CancelDisputeModal.secondaryButtonText")}
            </Button>
          ),
        }}
        message={t("PaymentDisputes.DisputeReasonsModal.CancelDisputeModal.message")}
        title={t("PaymentDisputes.DisputeReasonsModal.CancelDisputeModal.title")}
        isVisible={isCancelDisputeModalVisible}
      />
    </>
  );
}
