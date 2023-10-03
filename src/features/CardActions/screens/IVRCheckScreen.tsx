import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef } from "react";

import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { CardActionsStackParams } from "../CardActionsStack";
import { INTERVAL, MAX_ALLOWED_RETRIES } from "../constants";
import { useActivateCard } from "../hooks/query-hooks";

export default function IVRCheckScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.IVRCheckScreen">>();
  const handleVerification = route.params.onVerificationComplete;
  const params = route.params;
  const elapsedTimeInSeconds = useRef(0);
  const { data: cardStatusData } = useActivateCard(params.cardId, INTERVAL);

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
    if (cardStatusData?.Status === "ACTIVATE") {
      handleVerification();
      navigation.goBack();
    }
  }, [cardStatusData]);

  return (
    <Page>
      <ContentContainer>
        <FullScreenLoader title={params.title} message={params.message} />
      </ContentContainer>
    </Page>
  );
}
