import { Image, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useOrderCardContext } from "../../context/OrderCardContext";

export default function SelectStandardCard() {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      flex: 1,
      justifyContent: "space-between",
      padding: theme.spacing.medium,
    }),
    []
  );

  const standardCardId = {
    cardType: 1,
    cardProductId: 1356,
  };

  const navigation = useNavigation();
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();

  const handleOnPress = () => {
    setOrderCardValues !== null &&
      setOrderCardValues({
        ...orderCardValues,
        formValues: { ...orderCardValues.formValues, ...standardCardId },
      });

    navigation.navigate("Cards.CreateCardPin");
  };

  return (
    <View style={container}>
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
});
