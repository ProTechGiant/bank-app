import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

import { DisputeReasonsList } from "../components";
import { useReasons } from "../hooks/query-hooks";
import { PaymentDisputesStackParams } from "../PaymentDisputesStack";

export default function SelectDisputeReasonModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<PaymentDisputesStackParams, "PaymentDisputes.SelectDisputeReasonModal">>();

  const { data, isError } = useReasons(route.params.transactionType);
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
    setTimeout(() => {
      navigation.navigate("PaymentDisputes.PaymentDisputesLandingModal");
    }, 300);
  };

  const handleOnPressReason = (disputeReasonsCode: string) => {
    navigation.navigate("PaymentDisputes.DisputeDetailsModal", {
      disputeReasonsCode: disputeReasonsCode,
    });
  };

  useEffect(() => {
    if (isError) {
      setIsErrorModalVisible(true);
    }
  }, [isError]);

  return (
    <>
      <Page insets={["bottom", "left", "right"]}>
        <SafeAreaProvider>
          <NavHeader withBackButton end={<NavHeader.CloseEndButton onPress={handleOnOpenConfirmCancelDispute} />} />
          {data !== undefined ? (
            <ContentContainer isScrollView>
              <Stack direction="vertical" gap="48p" align="stretch" flex={1}>
                <Typography.Text size="title1" weight="medium">
                  {t("PaymentDisputes.SelectDisputeReasonModal.title")}
                </Typography.Text>
                <DisputeReasonsList data={data.ProblemCategories} onPress={handleOnPressReason} />
              </Stack>
            </ContentContainer>
          ) : (
            <FlexActivityIndicator />
          )}
        </SafeAreaProvider>
      </Page>
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
