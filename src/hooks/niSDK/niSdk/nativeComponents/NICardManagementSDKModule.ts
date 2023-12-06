import { NativeModules, Platform } from "react-native";

import { NICardManagementInterface } from "../../types";

const { NICardManagementIOSModule, NICardManagementAndroidModule } = NativeModules;

const NICardManagementSDKModule = Platform.OS === "ios" ? NICardManagementIOSModule : NICardManagementAndroidModule;

export default NICardManagementSDKModule as NICardManagementInterface;
