import React from "react";
import { Text, View } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import useNavigation from "@/navigation/use-navigation";

export default function DisputeDetailsModal() {
  const navigation = useNavigation();

  const handleOnPressTermsAndConditions = () => {
    navigation.navigate("PaymentDisputes.TermsAndConditionsModal");
  };

  return (
    <View>
      <NavHeader withBackButton />
      <Text>DisputeDetailsModal</Text>
      <Button onPress={handleOnPressTermsAndConditions}>Terms and Conditions</Button>
    </View>
  );
}
