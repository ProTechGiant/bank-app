import { useState } from "react";
import { useTranslation } from "react-i18next";

import HeroSlider from "@/components/HeroSlider";
import NotificationModal from "@/components/NotificationModal";
import { SINGLE_USE_CARD_TYPE, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import useSubmitOrderCard from "@/hooks/use-submit-order-card";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { generateRandomId } from "@/utils";

import PlaceholderCardSvg from "./placeholder-card.svg";

export default function SingleUseCardInfo() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const submitOrderCard = useSubmitOrderCard();
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleOnGenerateCard = async () => {
    const correlationId = generateRandomId();

    try {
      const response = await submitOrderCard.mutateAsync({
        correlationId,
        values: {
          CardType: SINGLE_USE_CARD_TYPE,
          CardProductId: STANDARD_CARD_PRODUCT_ID,
        },
      });

      if (typeof response.OtpId !== "string") {
        throw new Error("No OtpId received from back-end");
      }

      navigation.navigate("CardActions.OneTimePasswordModal", {
        correlationId,
        redirect: "CardActions.LoadingSingleCardScreen",
        action: "generate-single-use-card",
        otp: {
          otpId: response.OtpId,
          otpCode: response.OtpCode,
          phoneNumber: response.PhoneNumber,
        },
      });
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not create SUC card: ", JSON.stringify(error));
    }
  };

  const handleOnCloseNotification = () => {
    setShowErrorModal(false);
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
        isVisible={showErrorModal}
        onClose={handleOnCloseNotification}
      />
    </>
  );
}
