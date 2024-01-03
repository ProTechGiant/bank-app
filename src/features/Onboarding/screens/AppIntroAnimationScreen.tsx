import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import appLoaderAnimation from "@/assets/illustrations/app-intro.json";
import AnimationView from "@/components/AnimationView";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import { useSearchUserByNationalId } from "@/hooks/use-search-user-by-national-id";
import useCheckTPPService from "@/hooks/use-tpp-service";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { getUniqueDeviceId } from "@/utils";
import {
  clearStorage,
  getItemFromEncryptedStorage,
  hasItemInStorage,
  removeItemFromEncryptedStorage,
  setItemInEncryptedStorage,
} from "@/utils/encrypted-storage";

export default function AppIntroAnimationScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const auth = useAuthContext();

  const { mutateAsync: searchForUser } = useSearchUserByNationalId();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();

  const goToOnboardingStack = () => {
    // If logged out using account screen then we don't want to do navigation from here for the splash screen because we are navigating from signout Modal and navigating to sign in screen
    if (auth.logoutUsingAccount && auth.isLogout) return;
    navigation.navigate("Onboarding.OnboardingStack", {
      screen: "Onboarding.SplashScreen",
    });
  };

  const handleNavigation = async () => {
    const userData = await getItemFromEncryptedStorage("user");

    if (userData) {
      const userDataObject = JSON.parse(userData);
      try {
        await handleGetAuthenticationToken();
        const deviceId = await getUniqueDeviceId();
        const res = await searchForUser({
          NationalId: userDataObject.NationalId,
          MobileNumber: userDataObject.MobileNumber,
        });

        if (userData && res?.DeviceId === deviceId && res?.DeviceStatus === "R") {
          navigation.navigate("SignIn.SignInStack", { screen: "SignIn.Passcode" });
          return;
        } else {
          await removeItemFromEncryptedStorage("user");
          if (auth.isLogout) {
            navigation.navigate("SignIn.SignInStack", { screen: "SignIn.Iqama" });
          } else {
            goToOnboardingStack();
          }
        }
      } catch (err) {
        goToOnboardingStack();
      }
    } else {
      goToOnboardingStack();
    }
  };

  const handleGetAuthenticationToken = async () => {
    const res = await getAuthenticationToken();
    if (typeof res?.AccessToken === "string") {
      setItemInEncryptedStorage("authToken", res.AccessToken);
      auth.setAuthToken(res.AccessToken);
    }
  };

  const comingFromTPP = useCheckTPPService();

  const setFirstStackForUser = async () => {
    async function continueAfterAnimation() {
      try {
        handleGetAuthenticationToken();

        const hasOpenedBefore = await hasItemInStorage("hasSeenOnboarding");
        if (hasOpenedBefore) {
          try {
            if (comingFromTPP) {
              navigation.navigate("SignIn.SignInStack", {
                screen: "SignIn.Iqama",
              });
            } else {
              handleNavigation();
            }
          } catch (err) {
            goToOnboardingStack();
          }
        } else {
          if (comingFromTPP) {
            navigation.navigate("SignIn.SignInStack", {
              screen: "SignIn.Iqama",
            });
          } else {
            await clearStorage();

            navigation.navigate("Onboarding.WelcomeCarousel");
            handleGetAuthenticationToken();
          }
        }
      } catch (error) {
        goToOnboardingStack();
      }
    }

    setTimeout(() => continueAfterAnimation(), ANIMATION_DURATION_MS);
  };

  useEffect(() => {
    if (comingFromTPP) {
      handleGetAuthenticationToken();
    }

    navigation.addListener("focus", setFirstStackForUser);

    return () => {
      navigation.removeListener("focus", setFirstStackForUser);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, comingFromTPP]);

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
