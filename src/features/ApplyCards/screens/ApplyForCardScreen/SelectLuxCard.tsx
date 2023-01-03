import { StyleSheet, View, Image } from "react-native";

import useNavigation from "@/navigation/use-navigation";
import { spacing } from "@/theme/values";

import Button from "@/components/Button";
import Typography from "@/components/Typography";

export default function SelectLuxCard() {
  const navigation = useNavigation();

  const handleOnPress = () => {
    navigation.navigate("Cards.ApplyForLuxCard");
  };

  return (
    <View style={styles.container}>
      <View style={{ height: "80%" }}>
        <Image style={{ height: 220, width: 380 }} source={require("@/assets/images/lux-card-placeholder.png")} />
      </View>
      <View>
        <Typography.Text size="caption1" color="neutralBase" style={styles.text}>
          Lux is FREE when you upgrade to Croatia Plus
        </Typography.Text>
      </View>
      <Button onPress={handleOnPress} style={styles.button}>
        <Typography.Text color="neutralBase-50" size="body" weight="medium">
          Get Lux Card with Croatia Plus
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
  text: {
    textAlign: "center",
  },
});
