import { SafeAreaView, Text, View } from "react-native";

import { useOrderCardContext } from "@/contexts/OrderCardContext";

export default function CardOrderedScreen() {
  const { orderCardValues } = useOrderCardContext();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>Card Ordered</Text>
        <Text>{orderCardValues.formState.error?.message}</Text>
      </View>
    </SafeAreaView>
  );
}
