import * as React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { spacing } from "@/theme/values";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import NavHeader from "@/components/NavHeader";
import { Icons } from "@/assets/icons";
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import useNavigation from "@/navigation/use-navigation";

import { useOrderCardContext } from "@/contexts/OrderCardContext";

export default function CardOrderedScreen() {
  const navigation = useNavigation();

  const handleOnAddToWallet = () => {
    console.log("pressed Add to Wallet");
  };

  const handleOnClose = () => {
    navigation.navigate("Temporary.LandingScreen");
  };
  const { orderCardValues } = useOrderCardContext();

  return (
    <DarkOneGradient>
      <SafeAreaView style={{ flex: 1 }}>
        <NavHeader title="" backButton={false} color="white" />
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icons.Shipping />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.title}>
              <Typography.Text size="large" weight="bold" color="neutralBase-50">
                {orderCardValues.formState.error?.message ? orderCardValues.formState.error?.message : "Card ordered"}
              </Typography.Text>
            </View>
          </View>
          <View style={styles.buttons}>
            <Button
              style={styles.button}
              color="alt"
              onPress={handleOnAddToWallet}
              disabled={orderCardValues.formState.error && true}>
              Add to Wallet
            </Button>
            <Button
              style={styles.button}
              variant="tertiary"
              onPress={handleOnClose}
              disabled={orderCardValues.formState.error && true}>
              <Typography.Text color="neutralBase-50">Not now</Typography.Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </DarkOneGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconContainer: {
    paddingVertical: spacing.large,
    justifyContent: "center",
  },
  textContainer: {
    height: "20%",
    alignItems: "center",
    padding: spacing.small,
  },
  title: {
    paddingBottom: spacing.medium,
  },
  button: {
    minWidth: 350,
  },
  buttons: {
    height: "60%",
    justifyContent: "flex-end",
  },
});
