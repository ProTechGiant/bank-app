import { SafeAreaView } from "react-native";

import ApplyCardHeader from "@/components/ApplyForCardHeader";

export default function SecureMessageScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ApplyCardHeader title="3D Secure Message" backButton={true} />
    </SafeAreaView>
  );
}
