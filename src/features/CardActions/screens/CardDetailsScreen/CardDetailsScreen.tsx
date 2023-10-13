import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { STANDARD_CARD_PRODUCT_ID } from "@/constants";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

import { isSingleUseCard } from "../../helpers";
import { useCard } from "../../hooks/query-hooks";
import CardDetailsScreenInner from "./CardDetailsScreenInner";

export default function CardDetailsScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.CardDetailsScreen">>();
  const { t } = useTranslation();

  const { data: selectedCard, isError } = useCard(params.cardId);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  useEffect(() => {
    setIsErrorModalVisible(isError);
  }, [isError]);

  const handleOnBackPress = () => {
    if (params.isSingleUseCardCreated) navigation.goBack();
    navigation.goBack();
  };

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          onBackPress={handleOnBackPress}
          title={
            selectedCard === undefined
              ? undefined
              : isSingleUseCard(selectedCard)
              ? t("CardActions.CardDetailsScreen.navTitleSingleUse")
              : selectedCard.ProductId === STANDARD_CARD_PRODUCT_ID
              ? t("CardActions.CardDetailsScreen.navTitleStandard")
              : t("CardActions.CardDetailsScreen.navTitlePlus")
          }
          testID="CardActions.CardDetailsScreen:NavHeader"
        />
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
