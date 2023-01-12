import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ApplyCardsStack from "@/features/ApplyCards/ApplyCardModalStack";
import ApplyForCardScreen from "@/features/ApplyCards/screens/ApplyForCardScreen";
import ApplyForLuxCardScreen from "@/features/ApplyCards/screens/ApplyForLuxCardScreen";
import SetTemporaryAddressScreen from "@/features/ApplyCards/screens/SetTemporaryAddressScreen";
import DashboardScreen from "@/features/Home/screens/DashboardScreen";
import HomepageReorderModal from "@/features/Home/screens/HomepageReorderModal";
import QuickActionsReorderCard from "@/features/Home/screens/QuickActionsReorderModal";
import ConfirmPersonalDetailsScreen from "@/features/Onboarding/screens/ConfirmPersonalDetailsScreen";
import FinancialInformationScreen from "@/features/Onboarding/screens/FinancialInformationScreen";
import ForeignTaxScreen from "@/features/Onboarding/screens/ForeignTaxScreen";
import IqamaInputScreen from "@/features/Onboarding/screens/IqamaInputScreen";
import NafathAuthScreen from "@/features/Onboarding/screens/NafathAuthScreen";
import OnboardingSplashScreen from "@/features/Onboarding/screens/OnboardingSplashScreen";
import OptionalEmailScreen from "@/features/Onboarding/screens/OptionalEmailScreen";
import HubScreen from "@/features/Referral/screens/HubScreen";
import SettingsScreen from "@/features/Settings/screens/SettingsScreen";
import TemporaryLandingScreen from "@/features/Temporary/TemporaryLandingScreen";

import MainStackParams from "./mainStackParams";

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
        <Stack.Screen
          component={SettingsScreen}
          name="Settings.SettingsScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen component={HubScreen} name="Referral.HubScreen" options={{ headerShown: false }} />
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
        <Stack.Group screenOptions={{ headerShown: false, presentation: "modal" }}>
          <Stack.Screen component={ApplyForCardScreen} name="ApplyCards.ApplyForCard" />
          <Stack.Screen component={ApplyForLuxCardScreen} name="ApplyCards.ApplyForLuxCard" />
          <Stack.Screen
            component={SetTemporaryAddressScreen}
            name="ApplyCards.SetTemporaryAddress"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={ApplyCardsStack}
            name="ApplyCards.OrderCardModal"
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{ headerShown: false, presentation: "modal" }}>
          <Stack.Screen
            options={{ headerShown: false }}
            component={QuickActionsReorderCard}
            name="Modal.QuickActionsReorderModal"
          />
          <Stack.Screen
            options={{ headerShown: false }}
            component={HomepageReorderModal}
            name="Modal.HomepageReorderModal"
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
