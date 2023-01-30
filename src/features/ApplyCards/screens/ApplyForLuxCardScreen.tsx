import { SafeAreaView } from "react-native";

import NavHeader from "@/components/NavHeader";

export default function ApplyForLuxCardScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavHeader title="Order Lux Card" right="close" />
    </SafeAreaView>
  );
}
