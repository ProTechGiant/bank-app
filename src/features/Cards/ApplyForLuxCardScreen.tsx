import { SafeAreaView } from "react-native";

import ApplyCardHeader from "@/components/ApplyForCardHeader";

export default function ApplyForLuxCardScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ApplyCardHeader title="Order Lux Card" backButton={true} />
    </SafeAreaView>
  );
}
