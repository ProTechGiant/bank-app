import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { useEffect } from "react";
import { StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
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

import { NotificationContextProvider } from "./contexts/NotificationContext";

const queryClient = new QueryClient();
export default function CroatiaApp() {
  useDeviceLanguage();

  useEffect(() => {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
    View.defaultProps = View.defaultProps || {};
    View.defaultProps.allowFontScaling = false;
  }, []);
  return (
    <ActionSheetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <ReferralContextProvider>
            <InternalTransferContextProvider>
              <SafeAreaProvider>
                <ToastsContextProvider>
                  <NotificationContextProvider>
                    <GestureHandlerRootView style={styles.container}>
                      <StatusBar barStyle="dark-content" />
                      <MainStack onReady={() => RNBootSplash.hide()} />
                    </GestureHandlerRootView>
                  </NotificationContextProvider>
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
