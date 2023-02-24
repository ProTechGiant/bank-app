import { NavigationProp, useNavigation as rnUseNavigation } from "@react-navigation/native";

import type MainStackParams from "./mainStackParams";

export default function useNavigation() {
  return rnUseNavigation<NavigationProp<MainStackParams>>();
}
