import { ScrollView, StyleSheet, View } from "react-native";

import ApplyCardHeader from "@/components/ApplyForCardHeader";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import { palette, spacing } from "@/theme/values";
import DetailsTile from "@/components/DetailsTile";
import MoreInfoDropdown from "@/features/MoreInfoDropdown";
import ConfirmPersonalDetailsForm from "@/components/Forms/ConfirmPersonalDetails/ConfirmPersonalDetailsForm";

const ConfirmPersonalDetailsScreen = () => {
  return (
    <ScrollView style={{ marginTop: 32 }}>
      <ApplyCardHeader title="CONFIRMATION" backButton={true} />
      <View>
        <View style={styles.paddedView}>
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={1} totalStep={6} />
          </View>
          <View style={styles.header}>
            <Typography.Header size="large" weight="bold">
              Confirm your personal details
            </Typography.Header>
          </View>
          <View style={{ marginBottom: spacing.medium }}>
            <DetailsTile />
          </View>
          <MoreInfoDropdown title="I need to change my details">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              Visit{" "}
              <Typography.Text color="neutralBase" size="footnote" weight="bold">
                absher.sa
              </Typography.Text>{" "}
              to change your details. Please restart the process when your Absher profile has been updated. This can
              take up to 72 hours.
            </Typography.Text>
          </MoreInfoDropdown>
        </View>
        <View style={styles.footer}>
          <ConfirmPersonalDetailsForm />
        </View>
      </View>
    </ScrollView>
  );
};
export default ConfirmPersonalDetailsScreen;

const styles = StyleSheet.create({
  paddedView: {
    flex: 1,
    padding: spacing.medium,
    marginBottom: 70,
  },
  progressIndicator: {
    marginTop: 12,
    marginBottom: 44,
  },
  header: {
    paddingBottom: spacing.medium,
  },
  footer: {
    height: "100%",
    backgroundColor: palette["neutralBase-50"],
  },
});
