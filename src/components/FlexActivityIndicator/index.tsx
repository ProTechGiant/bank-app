import { ActivityIndicator, View } from "react-native";

export default function FlexActivityIndicator() {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
      <ActivityIndicator />
    </View>
  );
}
