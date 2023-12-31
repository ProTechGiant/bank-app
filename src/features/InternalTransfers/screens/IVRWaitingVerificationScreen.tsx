import { useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import delayTransition from "@/utils/delay-transition";

import { useIVRInitialization } from "../hooks/query-hooks";

export default function IVRWaitingVerificationScreen() {
  const { t } = useTranslation();
  const route = useRoute();
  const getIVRTrackingId = (route.params as { ivrTrackingId?: string })?.ivrTrackingId ?? "";
  const navigation = useNavigation();
  const [errorStatus, setIsErrorStatus] = useState(false);

  const { mutateAsync } = useIVRInitialization(getIVRTrackingId);

  const handleOnNavigate = useCallback(() => {
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.ChangeVerifiedScreen",
    });
  }, [navigation]);

  const fetchIVRStatus = useCallback(async () => {
    try {
      const response = await mutateAsync();
      if (response.Status.toLowerCase() === "success") {
        handleOnNavigate();
      }
    } catch {
      setIsErrorStatus(true);
    }
  }, [mutateAsync, handleOnNavigate, setIsErrorStatus]);

  useEffect(() => {
    fetchIVRStatus();
  }, [fetchIVRStatus]);

  return (
    <Page>
      <ContentContainer>
        <FullScreenLoader
          title={t("InternalTransfers.WaitingVerificationScreen.waitingVerification")}
          message={t("InternalTransfers.WaitingVerificationScreen.ivrWaitingMessage")}
        />
      </ContentContainer>
      <NotificationModal
        variant="error"
        title={t("errors.generic.somethingWentWrong")}
        message={t("errors.generic.tryAgainLater")}
        isVisible={errorStatus}
        onClose={() => {
          setIsErrorStatus(false);
          delayTransition(() => navigation.goBack());
        }}
      />
    </Page>
  );
}
