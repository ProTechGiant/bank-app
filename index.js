import "react-native-gesture-handler";
import "intl-pluralrules";

import { AppRegistry } from "react-native";

import { name as appName } from "./app.json";
import App from "./src/App";

AppRegistry.registerComponent(appName, () => App);
