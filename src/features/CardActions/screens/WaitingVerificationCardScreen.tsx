import { RouteProp, useRoute } from "@react-navigation/native";
import { t } from "i18next";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { CardActionsStackParams } from "../CardActionsStack";
import { useIVRValidations } from "../hooks/query-hooks";

const INTERVAL = 60;

export default function WaitingVerificationCard() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.WaitingVerificationCard">>();
  const params = route.params;
  const { isSuccess, mutateAsync } = useIVRValidations(params.cardId);
  const [isIVRFailure, setIVRFailure] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INTERVAL);

  useEffect(() => {
    fetchIVRStatus();
  }, []);

  const fetchIVRStatus = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      setIVRFailure(true);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    if (!timeLeft) {
      setIVRFailure(true);
    }
    if (isSuccess) {
      clearInterval(intervalId);
      navigation.navigate("CardActions.CardToWalletSuccessScreen");
    }
    return () => clearInterval(intervalId);
  }, [isSuccess, navigation, timeLeft]);

  const handleOnClose = () => {
    navigation.goBack();
  };

  return (
    <Page testID="CardActions.WaitingVerificationCardScreen:Page">
      <ContentContainer>
        <FullScreenLoader
          title={t("CardActions.WaitingVerificationCard.waitingVerificationTitle")}
          message={t("CardActions.WaitingVerificationCard.waitingVerificationMessage")}
        />
      </ContentContainer>
      <NotificationModal
        message={t("CardActions.WaitingVerificationCard.ivrFailureMessage")}
        isVisible={isIVRFailure}
        onClose={handleOnClose}
        title={t("CardActions.WaitingVerificationCard.ivrFailureTitle")}
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
