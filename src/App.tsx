import MainStack from "@/navigation/MainStack";
import { flags } from "@/config/feature-flag";
import { FlagsProvider } from "flagged";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlagsProvider features={flags}>
        <MainStack />
      </FlagsProvider>
    </GestureHandlerRootView>
  );
}
