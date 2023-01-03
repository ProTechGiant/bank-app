import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import NavHeader from "@/components/NavHeader";
import { spacing } from "@/theme/values";
import Typography from "@/components/Typography";

export default function SetAnotherAddressScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <NavHeader title="Set another address" backButton={false} />
        <ScrollView>
          <View style={styles.header}>
            <Typography.Text size="large" weight="bold">
              Enter your delivery address
            </Typography.Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.medium,
  },
  header: {
    paddingVertical: spacing.medium,
  },
});
