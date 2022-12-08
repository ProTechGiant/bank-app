import { StyleSheet, View } from "react-native";

import useNavigation from "@/navigation/use-navigation";
import { spacing } from "@/theme/values";

import Button from "../Button";
import Typography from "../Typography";

export default function SelectLuxCard() {
  const navigation = useNavigation();

  const handleOnPress = () => {
    navigation.navigate("Cards.ApplyForLuxCard");
  };

  return (
    <View style={styles.container}>
      <View style={{ height: "70%" }}>
        <Typography.Text>Lux Card</Typography.Text>
      </View>
      <View style={styles.textContainer}>
        <Typography.Text size="caption1" color="neutralBase" style={styles.text}>
          Lux Card is FREE if you upgrade your tier and subscribe to Croatia Plus
        </Typography.Text>
      </View>
      <Button onPress={handleOnPress} style={styles.button}>
        <Typography.Text color="neutralBase-50" size="body">
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
  textContainer: {
    padding: spacing.large,
  },
});
