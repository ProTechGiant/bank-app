import { Platform } from "react-native";

import { NIInputInterface } from "../../types";

const formatInput = (input: NIInputInterface) => (Platform.OS === "ios" ? input : JSON.stringify(input));

export default formatInput;
