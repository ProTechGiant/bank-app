import { Image, StyleSheet, View } from "react-native";

import useNavigation from "@/navigation/use-navigation";
import { spacing } from "@/theme/values";

import Button from "../Button";
import Typography from "../Typography";

export default function SelectStandardCard() {
  const navigation = useNavigation();

  const handleOnPress = () => {
    navigation.navigate("Cards.CreateCardPin");
  };

  return (
    <View style={styles.container}>
      <View>
        <Image style={{ height: 220, width: 380 }} source={require("@/assets/images/standard-card-placeholder.png")} />
      </View>
      <Button onPress={handleOnPress} style={styles.button}>
        <Typography.Text color="neutralBase-50" size="body" weight="medium">
          Get Standard Card for FREE
        </Typography.Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 350,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.medium,
  },
});
