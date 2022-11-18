import { StyleSheet, View } from "react-native";

export default function CenterView({ children }: { children: React.ReactNode }) {
  return <View style={styles.main}>{children}</View>;
}

const styles = StyleSheet.create({
  main: {
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    flex: 1,
    justifyContent: "center",
  },
});
