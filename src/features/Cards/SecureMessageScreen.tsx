import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import ApplyCardHeader from "@/components/ApplyForCardHeader";
import Toast from "@/components/Toast";
import Typography from "@/components/Typography";
import { spacing } from "@/theme/values";

export default function SecureMessageScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ApplyCardHeader title="Order card" backButton={true} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography.Header size="large" weight="bold">
            Set up 3D Secure Payments
          </Typography.Header>
        </View>
        <View style={styles.paragraph}>
          <Typography.Text>
            Enter a message of your choice below. It’ll appear when you make a payment so you know it’s a genuine
            transaction.
          </Typography.Text>
        </View>
        <Toast
          borderPosition="left"
          title="What is 3D Secure?"
          content="An extra layer of security. If you don’t see your message when you’re making a payment, it could be fraud."
          variant="compliment"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
  },
  header: {
    paddingBottom: spacing.medium,
  },
  paragraph: {
    paddingBottom: spacing.large,
  },
});
