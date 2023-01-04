import * as React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { ShippingIcon } from "@/assets/icons";
import Button from "@/components/Button";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { spacing } from "@/theme/values";

import { useOrderCardContext } from "../context/OrderCardContext";

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
            <ShippingIcon />
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
  button: {
    minWidth: 350,
  },
  buttons: {
    height: "40%",
    justifyContent: "flex-end",
  },
  container: {
    alignItems: "center",
    justifyContent: "space-around",
  },
  iconContainer: {
    justifyContent: "center",
    paddingVertical: spacing.large,
  },
  textContainer: {
    alignItems: "center",
    height: "40%",
    padding: spacing.small,
  },
  title: {
    paddingBottom: spacing.medium,
    paddingHorizontal: spacing.small,
  },
});
