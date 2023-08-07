import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { StatusBar, StyleSheet } from "react-native";
import RNBootSplash from "react-native-bootsplash";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";

import { AuthContextProvider } from "@/contexts/AuthContext";
import { InternalTransferContextProvider } from "@/contexts/InternalTransfersContext";
import { ReferralContextProvider } from "@/contexts/ReferralContext";
import { ToastsContextProvider } from "@/contexts/ToastsContext";
import { useDeviceLanguage } from "@/i18n";
import MainStack from "@/navigation/MainStack";

const queryClient = new QueryClient();
export default function CroatiaApp() {
  useDeviceLanguage();

  return (
    <ActionSheetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <ReferralContextProvider>
            <InternalTransferContextProvider>
              <SafeAreaProvider>
                <ToastsContextProvider>
                  <GestureHandlerRootView style={styles.container}>
                    <StatusBar barStyle="dark-content" />
                    <MainStack onReady={() => RNBootSplash.hide()} />
                  </GestureHandlerRootView>
                </ToastsContextProvider>
              </SafeAreaProvider>
            </InternalTransferContextProvider>
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
