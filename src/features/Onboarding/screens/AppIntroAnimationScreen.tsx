import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import appLoaderAnimation from "@/assets/illustrations/app-intro.json";
import AnimationView from "@/components/AnimationView";
import Page from "@/components/Page";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import { useSearchUserByNationalId } from "@/hooks/use-search-user-by-national-id";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { getItemFromEncryptedStorage, hasItemInStorage, setItemInEncryptedStorage } from "@/utils/encrypted-storage";

export default function AppIntroAnimationScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();

  const { mutateAsync: searchForUser } = useSearchUserByNationalId();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();

  const goToOnboardingStack = () => {
    navigation.navigate("Onboarding.OnboardingStack", {
      screen: "Onboarding.SplashScreen",
    });
  };

  const handleNavigation = async () => {
    const userData = await getItemFromEncryptedStorage("user");
    if (userData) {
      const userDataObject = JSON.parse(userData);
      try {
        const res = await searchForUser({
          NationalId: userDataObject.NationalId,
          MobileNumber: userDataObject.MobileNumber,
        });
        if (res?.DeviceId === userDataObject.DeviceId && res?.DeviceStatus === "R") {
          navigation.navigate("SignIn.SignInStack", { screen: "SignIn.Passcode" });
          return;
        }
      } catch (err) {
        goToOnboardingStack();
      }
    }
    goToOnboardingStack();
  };

  useEffect(() => {
    async function continueAfterAnimation() {
      try {
        const hasOpenedBefore = await hasItemInStorage("hasSeenOnboarding");
        if (hasOpenedBefore) {
          const authToken = await getItemFromEncryptedStorage("authToken");
          if (authToken) {
            handleNavigation();
          } else {
            try {
              const res = await getAuthenticationToken();
              if (res?.AccessToken) {
                setItemInEncryptedStorage("authToken", res.AccessToken);
              }
              handleNavigation();
            } catch (err) {
              goToOnboardingStack();
            }
          }
        } else {
          navigation.navigate("Onboarding.WelcomeCarousel");
        }
      } catch (error) {
        goToOnboardingStack();
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
