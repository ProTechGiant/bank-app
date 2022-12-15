import { SafeAreaView, StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import ApplyCardHeader from "@/components/ApplyForCardHeader";
import ProgressIndicator from "@/components/ProgressIndicator";
import Toast from "@/components/Toast";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { spacing } from "@/theme/values";

export default function SecureMessageScreen() {
  const navigation = useNavigation();

  const handleOnPress = () => {
    navigation.navigate("Cards.CreateCardPin");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ApplyCardHeader title="Order card" backButton={true} />
      <View style={styles.container}>
        <View style={styles.progressIndicator}>
          <ProgressIndicator currentStep={1} totalStep={4} />
        </View>
        <View style={styles.header}>
          <Typography.Text size="large" weight="bold">
            Set up 3D Secure Payments
          </Typography.Text>
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
        <Button onPress={handleOnPress} style={styles.button}>
          <Typography.Text color="neutralBase-50" size="body" weight="medium">
            Save and continue
          </Typography.Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.medium,
  },
  progressIndicator: {
    marginTop: 12,
    marginBottom: 44,
  },
  header: {
    paddingBottom: spacing.medium,
  },
  paragraph: {
    paddingBottom: spacing.large,
  },
  button: {
    minWidth: 350,
    marginTop: "auto",
  },
});
