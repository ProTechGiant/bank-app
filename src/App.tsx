import "./i18n";

import { StatusBar, StyleSheet } from "react-native";
import RNBootSplash from "react-native-bootsplash";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";

import useI18nDirection from "@/i18n/use-i18n-direction";
import MainStack from "@/navigation/MainStack";

import { AuthContextProvider } from "./contexts/AuthContext";
import { GlobalContextProvider } from "./contexts/GlobalContext";
import { OnboardingContextProvider } from "./features/Onboarding/contexts/OnboardingContext";

const queryClient = new QueryClient();

export default function App() {
  useI18nDirection();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <GlobalContextProvider>
          <OnboardingContextProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <MainStack onReady={() => RNBootSplash.hide()} />
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </OnboardingContextProvider>
        </GlobalContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
