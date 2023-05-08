import "./i18n";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import RNBootSplash from "react-native-bootsplash";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";

import { AuthContextProvider } from "@/contexts/AuthContext";
import { ReferralContextProvider } from "@/contexts/ReferralContext";
import { InternalTransferContextProvider } from "@/features/InternalTransfers/context/InternalTransfersContext";
import { OnboardingContextProvider } from "@/features/Onboarding/contexts/OnboardingContext";
import useAppsFlyer from "@/hooks/use-appsflyer";
import useI18nDirection from "@/i18n/use-i18n-direction";
import MainStack from "@/navigation/MainStack";
import { initializeAppleWalletAsync } from "@/utils/apple-wallet";
import notifications from "@/utils/push-notifications";

initializeAppleWalletAsync();
const queryClient = new QueryClient();

export default function App() {
  useI18nDirection();
  const { initializeSdk } = useAppsFlyer();

  useEffect(() => {
    initializeSdk();
  }, []);

  useEffect(() => {
    async function main() {
      const status = await notifications.requestPermissions();

      if (status) {
        await notifications.registerForNotifications();
      }
    }

    main();
  }, []);

  return (
    <ActionSheetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <ReferralContextProvider>
            <OnboardingContextProvider>
              <InternalTransferContextProvider>
                <SafeAreaProvider>
                  <GestureHandlerRootView style={styles.container}>
                    <StatusBar barStyle="dark-content" />
                    <MainStack onReady={() => RNBootSplash.hide()} />
                  </GestureHandlerRootView>
                </SafeAreaProvider>
              </InternalTransferContextProvider>
            </OnboardingContextProvider>
          </ReferralContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
