import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import appLoaderAnimation from "@/assets/illustrations/app-intro.json";
import AnimationView from "@/components/AnimationView";
import Page from "@/components/Page";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { hasItemInStorage } from "@/utils/encrypted-storage";

export default function AppIntroAnimationScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();

  useEffect(() => {
    async function continueAfterAnimation() {
      try {
        const hasOpenedBefore = await hasItemInStorage("hasSeenOnboarding");

        if (hasOpenedBefore) {
          navigation.navigate("Onboarding.OnboardingStack", {
            screen: "Onboarding.SplashScreen",
          });
        } else {
          navigation.navigate("Onboarding.WelcomeCarousel");
        }
      } catch (error) {
        navigation.navigate("Onboarding.OnboardingStack", {
          screen: "Onboarding.SplashScreen",
        });
      }
    }

    setTimeout(() => continueAfterAnimation(), ANIMATION_DURATION_MS);
  }, [navigation]);

  return (
    <Page backgroundColor="neutralBase-60" insets={[]}>
      <View style={styles.container}>
        <AnimationView source={appLoaderAnimation} />
      </View>
    </Page>
  );
}

const ANIMATION_DURATION_MS = 2500;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
