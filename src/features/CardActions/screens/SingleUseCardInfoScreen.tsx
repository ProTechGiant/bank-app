import { useState } from "react";
import { useTranslation } from "react-i18next";

import HeroSlider from "@/components/HeroSlider";
import NotificationModal from "@/components/NotificationModal";
import { SINGLE_USE_CARD_TYPE, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import useSubmitOrderCard from "@/hooks/use-submit-order-card";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import PlaceholderCardSvg from "../assets/placeholder-card.svg";
import useOtpFlow from "../hooks/use-otp";
import { CardCreateResponse } from "../types";

export default function SingleUseCardInfoScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const otpFlow = useOtpFlow();
  const submitOrderCard = useSubmitOrderCard();
  const [isSubmitErrorModalVisible, setIsSubmitErrorModalVisible] = useState(false);

  const handleOnGenerateCard = async () => {
    try {
      const response = await submitOrderCard.mutateAsync({
        values: {
          CardType: SINGLE_USE_CARD_TYPE,
          CardProductId: STANDARD_CARD_PRODUCT_ID,
        },
      });

      otpFlow.handle<{ CardCreateResponse: CardCreateResponse | undefined }>({
        action: {
          to: "CardActions.SingleUseCardInfoScreen",
        },
        otpChallengeParams: {
          OtpId: response.OtpId,
          OtpCode: response.OtpCode,
          PhoneNumber: response.PhoneNumber,
          correlationId: response.correlationId,
        },
        onOtpRequestResend: () => {
          return submitOrderCard.mutateAsync({
            values: {
              CardType: SINGLE_USE_CARD_TYPE,
              CardProductId: STANDARD_CARD_PRODUCT_ID,
            },
          });
        },
        onFinish: (status, payload) => {
          if (status === "cancel") return;

          if (status === "fail" || payload?.CardCreateResponse?.Header.ErrorId !== "0") {
            return setIsSubmitErrorModalVisible(true);
          }

          setTimeout(() => {
            navigation.navigate("CardActions.CardDetailsScreen", {
              cardId: payload.CardCreateResponse.Body.CardId,
              isSingleUseCardCreated: true,
            });
          }, 500);
        },
      });
    } catch (error) {
      setIsSubmitErrorModalVisible(true);
      warn("card-actions", "Could not request single-use card: ", JSON.stringify(error));
    }
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
