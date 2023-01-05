import * as React from "react";
import { SafeAreaView, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { ShippingIcon } from "@/assets/icons";
import Button from "@/components/Button";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useOrderCardContext } from "../context/OrderCardContext";

export default function CardOrderedScreen() {
  const iconContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      justifyContent: "center",
      paddingVertical: theme.spacing.large,
    }),
    []
  );

  const textContainerStyle = useThemeStyles<TextStyle>(
    theme => ({
      alignItems: "center",
      height: "40%",
      padding: theme.spacing.small,
    }),
    []
  );
  const titleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingBottom: theme.spacing.medium,
      paddingHorizontal: theme.spacing.small,
    }),
    []
  );

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
          <View style={iconContainerStyle}>
            <ShippingIcon />
          </View>
          <View style={textContainerStyle}>
            <View style={titleStyle}>
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
});
