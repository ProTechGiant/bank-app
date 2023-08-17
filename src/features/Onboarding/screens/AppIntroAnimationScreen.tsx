import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import appLoaderAnimation from "@/assets/illustrations/app-intro.json";
import AnimationView from "@/components/AnimationView";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { hasItemInStorage } from "@/utils/encrypted-storage";

export default function AppIntroAnimationScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();

  useEffect(() => {
    async function hasOpened() {
      try {
        const hasOpenedBefore = await hasItemInStorage("hasSeenOnboarding");
        // Navigate to the onboarding welcome carousel if this is the first time viewing the app
        // Otherwise, navigate to the onboarding end splash screen
        setTimeout(() => {
          hasOpenedBefore
            ? navigation.navigate("Onboarding.OnboardingStack", { screen: "Onboarding.SplashScreen" })
            : navigation.navigate("Onboarding.WelcomeCarousel");
        }, 2500); // Change the delay time as needed (depending on lottie view speed)
      } catch (error) {
        // ..
      }
    }
    hasOpened();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <AnimationView source={appLoaderAnimation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
