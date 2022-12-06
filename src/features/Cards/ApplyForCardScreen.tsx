import { SafeAreaView, StyleSheet, View } from "react-native";

import ApplyCardHeader from "@/components/ApplyForCardHeader";

export default function ApplyForCardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <ApplyCardHeader title="Order card" backButton={false} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
