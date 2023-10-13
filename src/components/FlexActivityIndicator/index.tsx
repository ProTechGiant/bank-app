import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";

export default function FlexActivityIndicator({ color, size, testID }: ActivityIndicatorProps) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flexGrow: 1 }} testID={testID}>
      <ActivityIndicator color={color} size={size} />
    </View>
  );
}
