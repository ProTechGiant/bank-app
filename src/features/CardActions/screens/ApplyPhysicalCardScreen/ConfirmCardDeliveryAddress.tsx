import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import delayTransition from "@/utils/delay-transition";

import { useApplyForPhysicalCard, useUpdateAddress } from "../../hooks/query-hooks";
import CardDeliveryDetails from "../ApplyCardScreen/CardDeliveryDetailsScreen";

export default function ConfirmCardDeliveryAddress() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpFlow = useOtpFlow<AuthenticatedStackParams>();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.ConfirmCardDeliveryAddress">>();

  const applyPhysicalCard = useApplyForPhysicalCard();
  const updateAddress = useUpdateAddress();

  const cardId = useRef(route.params.cardId);
  const cardHolderName = useRef(route.params.cardHolderName);

  const [isError, setIsError] = useState(false);

  const handleOnCancelPressed = () => {
    //TODO: handle cancel card funcitonality.
  };

  const handleOnOtpVerificationSuccess = () => {
    navigation.navigate("CardActions.ApplyPhysicalCardSuccessScreen");
  };

  const handleOnConfirmOrderSummaryPress = () => {
    navigation.goBack();

    delayTransition(() => {
      setIsSubmitting(true);
      otpFlow.handle({
        action: {
          to: "CardActions.ConfirmCardDeliveryAddress",
          params: {
            cardId: cardId.current,
          },
        },
        otpOptionalParams: {
          CardId: cardId.current,
        },
        otpVerifyMethod: "card-actions",
        onOtpRequest: async () => {
          const resendResponse = await applyPhysicalCard.mutateAsync({
            cardId: cardId.current,
          });

          return resendResponse;
        },
        onFinish: status => {
          setIsSubmitting(false);
          if (status === "cancel") {
            return;
          }
          if (status === "fail") {
            setIsError(true);
          } else {
            handleOnOtpVerificationSuccess();
          }
        },
      });
    });
  };

  const handleOnSubmitPressed = async (isTemporaryAddressSelected: boolean) => {
    if (route.params.alternativeAddress !== undefined && isTemporaryAddressSelected) {
      try {
        setIsSubmitting(true);
        // TODO: will handle this once the API start working properly.
        await updateAddress.mutateAsync({
          cardId: cardId.current,
          cardHolderName: cardHolderName.current.toUpperCase(),
          cardType: "DEBIT",
          addressOne: route.params.alternativeAddress?.AddressLineOne,
          addressTwo: route.params.alternativeAddress?.AddressLineTwo,
          city: route.params.alternativeAddress?.City,
          postalCode: route.params.alternativeAddress?.District,
        });
        setIsSubmitting(false);

        navigation.navigate("CardActions.OrderNewCardSummaryScreen", { onDonePress: handleOnConfirmOrderSummaryPress });
      } catch (error) {
        setIsSubmitting(false);
        setIsError(true);
      }
    } else {
      navigation.navigate("CardActions.OrderNewCardSummaryScreen", { onDonePress: handleOnConfirmOrderSummaryPress });
    }
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader testID="CardActions.ConfirmCardDeliveryAddress:NavHeader" />
      <ContentContainer>
        <CardDeliveryDetails
          isSubmitting={isSubmitting}
          onCancel={handleOnCancelPressed}
          onSubmit={handleOnSubmitPressed}
          navigateTo="CardActions.ConfirmCardDeliveryAddress"
        />
      </ContentContainer>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isError}
        onClose={() => {
          setIsError(false);
        }}
      />
    </Page>
  );
}
