import React, { useState } from "react";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import delayTransition from "@/utils/delay-transition";

import CardDeliveryDetails from "../ApplyCardScreen/CardDeliveryDetailsScreen";

export default function ConfirmCardDeliveryAddress() {
  const navigation = useNavigation();

  const [isSubmitting] = useState(false);

  const handleOnCancelPressed = () => {
    console.log("On Cancel Pressed");
  };

  const handleOnOtpVerificationSuccess = () => {
    navigation.goBack();
    delayTransition(() => {
      navigation.navigate("CardActions.ApplyPhysicalCardSuccessScreen");
    });
  };

  const handleOnConfirmOrderSummaryPress = () => {
    // TODO:- Will Add OTP Flow later
    // TODO:- Currently implementing handleOnOtpVerificationSuccess which will replaced by otp flow
    handleOnOtpVerificationSuccess();
  };

  const handleOnSubmitPressed = () => {
    navigation.navigate("CardActions.OrderNewCardSummaryScreen", { onDonePress: handleOnConfirmOrderSummaryPress });
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader />
      <ContentContainer>
        <CardDeliveryDetails
          isSubmitting={isSubmitting}
          onCancel={handleOnCancelPressed}
          onSubmit={handleOnSubmitPressed}
          navigateTo="CardActions.ConfirmCardDeliveryAddress"
        />
      </ContentContainer>
    </Page>
  );
}
