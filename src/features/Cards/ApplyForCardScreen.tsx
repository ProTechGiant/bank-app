import { SafeAreaView, StyleSheet, View } from "react-native";

import ApplyCardHeader from "@/components/ApplyForCardHeader";
import SegmentedControl from "@/components/SegmentedControl";

export default function ApplyForCardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <ApplyCardHeader title="Order card" backButton={false} />
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
