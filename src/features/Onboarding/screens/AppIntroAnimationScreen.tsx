import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import appLoaderAnimation from "@/assets/illustrations/app-intro.json";
import AnimationView from "@/components/AnimationView";
import Page from "@/components/Page";
import { UserType, useSearchUserByNationalId } from "@/hooks/use-search-user-by-national-id";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { getItemFromEncryptedStorage, hasItemInStorage } from "@/utils/encrypted-storage";

export default function AppIntroAnimationScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();

  const { mutateAsync } = useSearchUserByNationalId();

  useEffect(() => {
    async function continueAfterAnimation() {
      try {
        const hasOpenedBefore = await hasItemInStorage("hasSeenOnboarding");
        if (hasOpenedBefore) {
          const userData = (await getItemFromEncryptedStorage("user")) as UserType | null;
          if (userData) {
            try {
              const res = await mutateAsync({
                NationalId: userData.NationalId,
                MobileNumber: userData.MobileNumber,
              });
              if (res?.DeviceId === userData.DeviceId && res?.DeviceStatus === "R") {
                navigation.navigate("SignIn.SignInStack", { screen: "SignIn.Passcode" });
                return;
              }
            } catch (err) {}
          }
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
