import { useState } from "react";
import { useTranslation } from "react-i18next";

import HeroSlider from "@/components/HeroSlider";
import NotificationModal from "@/components/NotificationModal";
import { SINGLE_USE_CARD_TYPE, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import useNavigation from "@/navigation/use-navigation";

import { useOtpFlow } from "../../OneTimePassword/hooks/query-hooks";
import PlaceholderCardSvg from "../assets/placeholder-card.svg";
import useSubmitOrderCard from "../hooks/query-hooks";
import { CardCreateResponse } from "../types";

export default function SingleUseCardInfoScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const otpFlow = useOtpFlow();
  const submitOrderCard = useSubmitOrderCard();
  const [isSubmitErrorModalVisible, setIsSubmitErrorModalVisible] = useState(false);

  const handleOnGenerateCard = async () => {
    otpFlow.handle<{ CardCreateResponse: CardCreateResponse | undefined }>({
      action: {
        to: "CardActions.SingleUseCardInfoScreen",
      },
      otpVerifyMethod: "card-actions",
      onOtpRequest: () => {
        return submitOrderCard.mutateAsync({
          values: {
            CardType: SINGLE_USE_CARD_TYPE,
            CardProductId: STANDARD_CARD_PRODUCT_ID,
          },
        });
      },
      onFinish: (status, payload) => {
        if (status === "cancel") {
          return;
        }

        if (status === "fail" || payload?.CardCreateResponse?.Header.ErrorId !== "0") {
          setTimeout(() => setIsSubmitErrorModalVisible(true), 500);
          return;
        }

        if (payload.CardCreateResponse === undefined) {
          return;
        }

        setTimeout(() => {
          navigation.navigate("CardActions.CardDetailsScreen", {
            cardId: payload.CardCreateResponse.Body.CardId,
            isSingleUseCardCreated: true,
          });
        }, 500);
      },
    });
  };

  const handleOnCloseNotification = () => {
    setIsSubmitErrorModalVisible(false);
  };

  return (
    <>
      <HeroSlider
        buttonText={t("CardActions.SingleUseCard.SingleUseCardsInfo.generateButton")}
        data={[
          {
            topElement: <PlaceholderCardSvg />,
            title: t("CardActions.SingleUseCard.SingleUseCardsInfo.title"),
            text: t("CardActions.SingleUseCard.SingleUseCardsInfo.text"),
          },
        ]}
        lastButtonText={t("CardActions.SingleUseCard.SingleUseCardsInfo.generateButton")}
        onFinishPress={handleOnGenerateCard}
        loading={submitOrderCard.isLoading}
      />
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isSubmitErrorModalVisible}
        onClose={handleOnCloseNotification}
      />
    </>
  );
}
