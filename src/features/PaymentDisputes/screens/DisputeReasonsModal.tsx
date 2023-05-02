import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";

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

const mockCardProblemCatagories: DisputeReasonType[] = [
  {
    ProblemCategoryCode: "100",
    ProblemCategoryName: "Duplicate bill",
    ProblemCategoryDescription: "I was charged more than once for a single transaction.",
    TransactionSourceCode: "CARD",
  },
  {
    ProblemCategoryCode: "101",
    ProblemCategoryName: "Didn't get goods or service",
    ProblemCategoryDescription: "I didn’t receive the goods or service I paid for.",
    TransactionSourceCode: "CARD",
  },
  {
    ProblemCategoryCode: "102",
    ProblemCategoryName: "Paid in a different way",
    ProblemCategoryDescription: "I’ve already paid with cash, cheque or another type of credit.",
    TransactionSourceCode: "CARD",
  },
  {
    ProblemCategoryCode: "103",
    ProblemCategoryName: "Wrong amount",
    ProblemCategoryDescription: "The payment is different to the amount I authorised.",
    TransactionSourceCode: "CARD",
  },
  {
    ProblemCategoryCode: "104",
    ProblemCategoryName: "Cancelled subscription",
    ProblemCategoryDescription: "I’ve already cancelled this subscription or membership.",
    TransactionSourceCode: "CARD",
  },
  {
    ProblemCategoryCode: "105",
    ProblemCategoryName: "Not refunded",
    ProblemCategoryDescription: "I’ve been refunded and have a receipt but haven’t had the refund.",
    TransactionSourceCode: "CARD",
  },
  {
    ProblemCategoryCode: "106",
    ProblemCategoryName: "Hotel cancellation",
    ProblemCategoryDescription: "This is a hotel booking that’s been cancelled.",
    TransactionSourceCode: "CARD",
  },
  {
    ProblemCategoryCode: "107",
    ProblemCategoryName: "I need a copy of the receipt",
    ProblemCategoryDescription: "You may need to pay additional charges to do this.",
    TransactionSourceCode: "CARD",
  },
  {
    ProblemCategoryCode: "108",
    ProblemCategoryName: "Too many transactions",
    ProblemCategoryDescription: "I only authorised one transaction at this merchant.",
    TransactionSourceCode: "CARD",
  },
  {
    ProblemCategoryCode: "109",
    ProblemCategoryName: "Something else",
    ProblemCategoryDescription: "",
    TransactionSourceCode: "CARD",
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

  const handleOnPressReason = (disputeReasonsCode: string) => {
    navigation.navigate("PaymentDisputes.DisputeDetailsModal", {
      disputeReasonsCode: disputeReasonsCode,
    });
  };

  return (
    <>
      <Page insets={["bottom", "left", "right"]}>
        <SafeAreaProvider>
          <NavHeader withBackButton end={<NavHeader.CloseEndButton onPress={handleOnOpenConfirmCancelDispute} />} />
          <ContentContainer isScrollView>
            <Stack direction="vertical" gap="48p" align="stretch" flex={1}>
              <Typography.Text size="title1" weight="medium">
                {t("PaymentDisputes.DisputeReasonsModal.title")}
              </Typography.Text>
              {mockCardProblemCatagories ? (
                <DisputeReasonsList data={mockCardProblemCatagories} onPressReason={handleOnPressReason} />
              ) : null}
            </Stack>
          </ContentContainer>
        </SafeAreaProvider>
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
              {t("PaymentDisputes.CancelDisputeModal.primaryButtonText")}
            </Button>
          ),
          secondary: (
            <Button onPress={handleOnCloseConfirmCancelDispute}>
              {t("PaymentDisputes.CancelDisputeModal.secondaryButtonText")}
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
