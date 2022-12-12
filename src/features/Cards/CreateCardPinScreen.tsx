import { SafeAreaView, StyleSheet, View } from "react-native";

import ApplyCardHeader from "@/components/ApplyForCardHeader";

export default function CreateCardPinScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <ApplyCardHeader title="Order card" backButton={true} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
