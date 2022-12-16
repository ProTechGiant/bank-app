import { SafeAreaView, StyleSheet, View } from "react-native";

import ApplyCardHeader from "@/components/ApplyForCardHeader";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import { spacing } from "@/theme/values";
import StayUpdatedEmailForm from "@/components/Forms/StayUpdatedEmail/StayUpdatedEmailForm";
import HideKeyboard from "@/helpers/HideKeyboard";

const OptionalEmailScreen = () => {
  return (
    <HideKeyboard>
      <SafeAreaView style={styles.container}>
        <ApplyCardHeader title="EMAIL" backButton={true} />
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
      </SafeAreaView>
    </HideKeyboard>
  );
};
export default OptionalEmailScreen;

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
