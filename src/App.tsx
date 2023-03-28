import "./i18n";

import { StatusBar, StyleSheet } from "react-native";
import RNBootSplash from "react-native-bootsplash";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";

import { AuthContextProvider } from "@/contexts/AuthContext";
import { ReferralContextProvider } from "@/contexts/ReferralContext";
import { OnboardingContextProvider } from "@/features/Onboarding/contexts/OnboardingContext";
import useAppsflyer from "@/hooks/use-appsflyer";
import useI18nDirection from "@/i18n/use-i18n-direction";
import MainStack from "@/navigation/MainStack";

const queryClient = new QueryClient();

export default function App() {
  useI18nDirection();
  useAppsflyer();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ReferralContextProvider>
          <OnboardingContextProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <MainStack onReady={() => RNBootSplash.hide()} />
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </OnboardingContextProvider>
        </ReferralContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
