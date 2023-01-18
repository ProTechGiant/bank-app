import { NativeModules } from "react-native";

export default function reloadApp() {
  if (!NativeModules.ReloadApp)
    throw new Error("Could not reload app. The `ReloadApp` module is not available on NativeModules");

  NativeModules.ReloadApp.reload();
}
