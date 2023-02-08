import "./i18n";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";

import useI18nDirection from "@/i18n/use-i18n-direction";
import MainStack from "@/navigation/MainStack";

import { GlobalContextProvider } from "./contexts/GlobalContext";
import { OnboardingContextProvider } from "./features/Onboarding/context/OnboardingContext";
import { SavingsGoalsContextProvider } from "./features/SavingsGoals/context/SavingsGoalsContext";

const queryClient = new QueryClient();

export default function App() {
  useI18nDirection();

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider>
        <OnboardingContextProvider>
          <SavingsGoalsContextProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <MainStack />
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </SavingsGoalsContextProvider>
        </OnboardingContextProvider>
      </GlobalContextProvider>
    </QueryClientProvider>
  );
}
