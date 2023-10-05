import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

import { useSubmitRenewCard } from "../../hooks/query-hooks";
import PickCardTypeScreen from "../ApplyCardScreen/PickCardTypeScreen";

export default function RenewCardScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.RenewCardScreen">>();
  const { t } = useTranslation();

  const { mutateAsync: renewCardAsync, isLoading } = useSubmitRenewCard();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const handleOnCancel = () => {
    navigation.goBack();
  };

  const handleOnCardSelect = async () => {
    try {
      await renewCardAsync({ values: { CardId: params.cardId, ActionType: "Renewal", Reason: "Expiration" } });
      navigation.navigate("CardActions.RenewCardSuccessScreen", {
        cardId: params.cardId,
      });
    } catch (error) {
      warn("renew-card", "Unable to renew card: ", JSON.stringify(error));
      setIsErrorModalVisible(true);
    }
  };

  return (
    <>
      <Page backgroundColor="neutralBase-60" insets={["top", "left", "right"]}>
        <PickCardTypeScreen
          onCancel={handleOnCancel}
          onSelected={handleOnCardSelect}
          isLoadingOnSelection={isLoading}
          variant="renew"
        />
      </Page>
      <NotificationModal
        variant="error"
        title={t("CardActions.ApplyCardScreen.CardRenewalScreen.RenewErrorModal.title")}
        message={t("CardActions.ApplyCardScreen.CardRenewalScreen.RenewErrorModal.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
    </>
  );
}
