import React from "react";
import { Text } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

export default function PaymentDisputesLandingModal() {
  const navigation = useNavigation();

  const handleOnPressDisputeReasons = () => {
    navigation.navigate("PaymentDisputes.DisputeReasonsModal");
  };

  return (
    <Page>
      <NavHeader withBackButton />
      <Text>Payment Disputes</Text>
      <Button onPress={handleOnPressDisputeReasons}>Dispute Reasons</Button>
    </Page>
  );
}
