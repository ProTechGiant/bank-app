import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ApplyForCardScreen from "@/features/Cards/ApplyForCardScreen";
import ApplyForLuxCardScreen from "@/features/Cards/ApplyForLuxCardScreen";
import SecureMessageScreen from "@/features/Cards/SecureMessageScreen";
import CreateCardPinScreen from "@/features/Cards/CreateCardPinScreen";
import CardDeliveryDetailsScreen from "@/features/Cards/CardDeliveryDetailsScreen";
import SetAnotherAddressScreen from "@/features/Cards/SetAnotherAddressScreen";
import CardOrderedScreen from "@/features/Cards/CardOrderedScreen";
import HomeDashboardScreen from "@/features/Home/HomeDashboardScreen";
import ConfirmPersonalDetailsScreen from "@/screens/Onboarding/ConfirmPersonalDetailsScreen/ConfirmPersonalDetailsScreen";
import NafathAuthScreen from "@/screens/Onboarding/NafathAuthScreen";
import IqamaInputScreen from "@/screens/Onboarding/IqamaInputScreen";
import OnboardingSplashScreen from "@/screens/Onboarding/OnboardingSplashScreen";
import TemporaryLandingScreen from "@/features/Temporary/TemporaryLandingScreen";

import MainStackParams from "./mainStackParams";
import QuickActionsReorderCard from "@/features/Cards/QuickActionsReorderModal";
import HomepageReorderModal from "@/features/Cards/HomepageReorderModal";
import FinancialInformationScreen from "@/screens/Onboarding/FinancialInformationScreen";
import ForeignTaxScreen from "@/screens/Onboarding/ForeignTaxScreen";
import OptionalEmailScreen from "@/screens/Onboarding/OptionalEmail/OptionalEmailScreen";
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
          component={HomeDashboardScreen}
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
