import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ApplyForCardScreen from "@/features/ApplyCards/screens/ApplyForCardScreen";
import ApplyForLuxCardScreen from "@/features/ApplyCards/screens/ApplyForLuxCardScreen";
import SecureMessageScreen from "@/features/ApplyCards/screens/SecureMessageScreen";
import CreateCardPinScreen from "@/features/ApplyCards/screens/CreateCardPinScreen";
import CardDeliveryDetailsScreen from "@/features/ApplyCards/screens/CardDeliveryDetailsScreen";
import SetAnotherAddressScreen from "@/features/ApplyCards/screens/SetAnotherAddressScreen";
import CardOrderedScreen from "@/features/ApplyCards/screens/CardOrderedScreen";
import DashboardScreen from "@/features/Home/screens/DashboardScreen";
import ConfirmPersonalDetailsScreen from "@/features/Onboarding/screens/ConfirmPersonalDetailsScreen";
import NafathAuthScreen from "@/features/Onboarding/screens/NafathAuthScreen";
import IqamaInputScreen from "@/features/Onboarding/screens/IqamaInputScreen";
import OnboardingSplashScreen from "@/features/Onboarding/screens/OnboardingSplashScreen";
import TemporaryLandingScreen from "@/features/Temporary/TemporaryLandingScreen";

import MainStackParams from "./mainStackParams";
import QuickActionsReorderCard from "@/features/Home/screens/QuickActionsReorderModal";
import HomepageReorderModal from "@/features/Home/screens/HomepageReorderModal";
import FinancialInformationScreen from "@/features/Onboarding/screens/FinancialInformationScreen";
import ForeignTaxScreen from "@/features/Onboarding/screens/ForeignTaxScreen";
import OptionalEmailScreen from "@/features/Onboarding/screens/OptionalEmailScreen";
const Stack = createNativeStackNavigator<MainStackParams>();

export default function MainStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={TemporaryLandingScreen}
          name="Temporary.LandingScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          component={DashboardScreen}
          name="Home.Dashboard"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen
            component={OnboardingSplashScreen}
            name="Onboarding.SplashScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen component={IqamaInputScreen} name="Onboarding.Iqama" />
          <Stack.Screen component={NafathAuthScreen} name="Onboarding.Nafath" options={{ headerShown: false }} />
          <Stack.Screen component={ConfirmPersonalDetailsScreen} name="Onboarding.ConfirmDetails" />
          <Stack.Screen
            component={OptionalEmailScreen}
            name="Onboarding.OptionalEmail"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={FinancialInformationScreen}
            name="Onboarding.Financial"
            options={{ headerShown: false }}
          />
          <Stack.Screen component={ForeignTaxScreen} name="Onboarding.ForeignTax" options={{ headerShown: false }} />
        </Stack.Group>
        <Stack.Group screenOptions={{ headerShown: false, animation: "slide_from_bottom" }}>
          <Stack.Screen component={ApplyForCardScreen} name="Cards.ApplyForCard" />
          <Stack.Screen
            options={{ animation: "default" }}
            component={ApplyForLuxCardScreen}
            name="Cards.ApplyForLuxCard"
          />
          <Stack.Screen options={{ animation: "default" }} component={CreateCardPinScreen} name="Cards.CreateCardPin" />
          <Stack.Screen options={{ animation: "default" }} component={SecureMessageScreen} name="Cards.SecureMessage" />
          <Stack.Screen
            options={{ animation: "default" }}
            component={CardDeliveryDetailsScreen}
            name="Cards.CardDeliveryDetails"
          />
          <Stack.Screen
            options={{ animation: "default" }}
            component={SetAnotherAddressScreen}
            name="Cards.SetAnotherAddress"
          />
          <Stack.Screen options={{ animation: "default" }} component={CardOrderedScreen} name="Cards.CardOrdered" />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            options={{ animation: "default", headerShown: false }}
            component={QuickActionsReorderCard}
            name="Modal.QuickActionsReorderModal"
          />
          <Stack.Screen
            options={{ animation: "default", headerShown: false }}
            component={HomepageReorderModal}
            name="Modal.HomepageReorderModal"
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
