import { NavigationProp, useNavigation as rnUseNavigation } from "@react-navigation/native";

import RouteParams from "./mainStackParams";

export default function useNavigation() {
  return rnUseNavigation<NavigationProp<RouteParams>>();
}
