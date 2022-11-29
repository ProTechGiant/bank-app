import { View } from "react-native";

import Button from "@/components/Button";
import useNavigation from "@/navigation/use-navigation";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TemporaryLandingScreen() {
  const navigation = useNavigation();

  const handleOnOpenApplyForCard = () => {
    navigation.navigate("Cards.ApplyForCard");
  };

  const handleOnHomepage = () => {
    navigation.navigate("Home.Dashboard");
  };

  return (
    <SafeAreaView>
      <View style={{ margin: 20 }}>
        <Button onPress={handleOnOpenApplyForCard}>Card Modal</Button>
      </View>
      <View style={{ margin: 20 }}>
        <Button onPress={handleOnHomepage}>Homepage</Button>
      </View>
    </SafeAreaView>
  );
}
