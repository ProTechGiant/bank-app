import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import NavHeader from "@/components/NavHeader";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import { spacing } from "@/theme/values";

import StayUpdatedEmailForm from "./StayUpdatedEmail/StayUpdatedEmailForm";

export default function OptionalEmailScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <NavHeader title="EMAIL" backButton={true} />
      <ScrollView>
        <View style={styles.innerView}>
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={2} totalStep={6} />
          </View>
          <View style={styles.header}>
            <Typography.Header size="large" weight="bold">
              Stay updated
            </Typography.Header>
          </View>
          <Typography.Text size="footnote" weight="regular">
            Share your email and we’ll keep you up to date with what’s new.
          </Typography.Text>

          <View style={styles.emailFormContainer}>
            <StayUpdatedEmailForm />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerView: {
    flex: 1,
    marginHorizontal: spacing.large,
  },
  progressIndicator: {
    marginTop: spacing.large,
  },
  header: {
    marginTop: spacing.regular,
    marginBottom: spacing.large,
  },
  emailFormContainer: {
    flex: 1,
    marginTop: spacing.large,
  },
});
