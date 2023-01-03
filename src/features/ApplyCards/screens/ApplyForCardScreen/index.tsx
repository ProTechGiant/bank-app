import { SafeAreaView, StyleSheet, View } from "react-native";

import NavHeader from "@/components/NavHeader";
import SegmentedControl from "./SegmentedControl";

export default function ApplyForCardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <NavHeader title="Order card" backButton={false} />
      </View>
      <SegmentedControl />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
