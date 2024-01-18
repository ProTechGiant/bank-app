import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";

import { useCard } from "../../hooks/query-hooks";
import CardDetailsScreenInner from "./CardDetailsScreenInner";

export default function CardDetailsScreen() {
  const { params } = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.CardDetailsScreen">>();
  const { t } = useTranslation();

  const { data: selectedCard, isError } = useCard(params.cardId);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  useEffect(() => {
    if (isError) {
      setIsErrorModalVisible(true);
    }
  }, [isError]);

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        {selectedCard === undefined ? (
          <FlexActivityIndicator testID="CardActions.CardDetailsScreen:LoadingIndicator" />
        ) : (
          <CardDetailsScreenInner
            card={selectedCard}
            onError={() => setIsErrorModalVisible(true)}
            isSingleUseCardCreated={params.isSingleUseCardCreated}
          />
        )}
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
    </>
  );
}
