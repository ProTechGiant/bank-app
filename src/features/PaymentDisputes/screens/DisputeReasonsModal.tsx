import React from "react";
import { Text, View } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import useNavigation from "@/navigation/use-navigation";

export default function DisputesReasonsModal() {
  const navigation = useNavigation();

  const handleOnPressDisputeDetails = () => {
    navigation.navigate("PaymentDisputes.DisputeDetailsModal");
  };

  return (
    <View>
      <NavHeader withBackButton />
      <Text>DisputesReasonsModal</Text>
      <Button onPress={handleOnPressDisputeDetails}>Dispute Details</Button>
    </View>
  );
}
