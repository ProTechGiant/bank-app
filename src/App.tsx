import "./i18n";

import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";

import useI18nDirection from "@/i18n/use-i18n-direction";
import MainStack from "@/navigation/MainStack";

import { AuthContextProvider } from "./contexts/AuthContext";
import { GlobalContextProvider } from "./contexts/GlobalContext";
import { OnboardingContextProvider } from "./features/Onboarding/context/OnboardingContext";

const queryClient = new QueryClient();

export default function App() {
  useI18nDirection();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <GlobalContextProvider>
          <OnboardingContextProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <MainStack />
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </OnboardingContextProvider>
        </GlobalContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
