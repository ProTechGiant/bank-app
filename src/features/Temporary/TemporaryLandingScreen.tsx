import { I18nManager, SafeAreaView, View } from "react-native";

import Button from "@/components/Button";
import useNavigation from "@/navigation/use-navigation";

export default function TemporaryLandingScreen() {
  const navigation = useNavigation();

  const handleOnOpenApplyForCard = () => {
    navigation.navigate("ApplyCards.ApplyForCard");
  };

  const handleOnHomepage = () => {
    navigation.navigate("Home.Dashboard");
  };

  const handleOnOpenOnboarding = () => {
    navigation.navigate("Onboarding.SplashScreen");
  };

  const handleOnOpenReferralHub = () => {
    navigation.navigate("Referral.HubScreen");
  };

  const handleOnSwitchDirection = () => {
    I18nManager.forceRTL(!I18nManager.isRTL);
  };

  return (
    <SafeAreaView>
      <View style={{ margin: 20 }}>
        <Button onPress={handleOnOpenApplyForCard}>Card Modal</Button>
      </View>
      <View style={{ margin: 20 }}>
        <Button onPress={handleOnHomepage}>Homepage</Button>
      </View>
      <View style={{ margin: 20 }}>
        <Button onPress={handleOnOpenOnboarding}>Onboarding</Button>
      </View>
      <View style={{ margin: 20 }}>
        <Button onPress={handleOnOpenReferralHub}>ReferralHub</Button>
      </View>
      <View style={{ margin: 20 }}>
        <Button onPress={handleOnSwitchDirection}>Switch LTR/ RTL</Button>
      </View>
    </SafeAreaView>
  );
}
