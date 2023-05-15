import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";

export default function FlexActivityIndicator({ color, size }: ActivityIndicatorProps) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
      <ActivityIndicator color={color} size={size} />
    </View>
  );
}
