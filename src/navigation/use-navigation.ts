import { NavigationProp, useNavigation as rnUseNavigation } from "@react-navigation/native";

import { StackParams } from "./MainStack";

export default function useNavigation() {
  return rnUseNavigation<NavigationProp<StackParams>>();
}
