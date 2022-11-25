import { View } from "react-native";

import Button from "@/components/Button";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

export default function HomeDashboardScreen() {
  const navigation = useNavigation();

  const handleOnOpenApplyForCard = () => {
    navigation.navigate("Cards.ApplyForCard");
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Typography.Text>Hello World!</Typography.Text>

      <Button onPress={handleOnOpenApplyForCard}>Open Apply Card Modal</Button>
    </View>
  );
}
