import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef } from "react";

import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { CardActionsStackParams } from "../CardActionsStack";
import { INTERVAL, MAX_ALLOWED_RETRIES } from "../constants";
import { useVerificationCardStatus } from "../hooks/query-hooks";

export default function WaitingVerificationCard() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.WaitingVerificationCard">>();
  const handleCallback = route.params.callback;
  const params = route.params;
  const elapsedTimeInSeconds = useRef(0);
  const { data: cardStatusData } = useVerificationCardStatus(params.cardId, INTERVAL);

  useEffect(() => {
    function checkIsSuccessful() {
      elapsedTimeInSeconds.current += 1;

      if (elapsedTimeInSeconds.current > MAX_ALLOWED_RETRIES) {
        navigation.goBack();
      }
    }

    const timeoutId = setInterval(checkIsSuccessful, INTERVAL);
    return () => clearInterval(timeoutId);
  }, []);

  useEffect(() => {
    if (cardStatusData?.is_valid === false) {
      handleCallback();
      navigation.goBack();
    }
  }, [cardStatusData]);

  return (
    <Page testID="CardActions.WaitingVerificationCardScreen:Page">
      <ContentContainer>
        <FullScreenLoader title={params.title} message={params.message} />
      </ContentContainer>
    </Page>
  );
}
