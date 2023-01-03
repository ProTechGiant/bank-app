import NavHeader from "@/components/NavHeader";
import FinancialForm from "@/features/Onboarding/screens/FinancialInformationScreen/FinancialForm/FinancialForm";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Stack } from "@/components/Stack";
import Typography from "@/components/Typography";
import MoreInfoDropdown from "@/features/Onboarding/components/MoreInfoDropdown";
import { spacing } from "@/theme/values";
import { StyleSheet, SafeAreaView, View, ScrollView } from "react-native";

const FinancialInformationScreen = () => {
  return (
    <SafeAreaView>
      <NavHeader title="ABOUT YOU" backButton={true} barStyle="dark-content" />
      <View style={styles.container}>
        <ProgressIndicator currentStep={3} totalStep={6} />
        <ScrollView>
          <View style={styles.headerContainer}>
            <Typography.Text size="large" weight="bold">
              Tell us about your finances
            </Typography.Text>
          </View>
          <Stack space="large">
            <MoreInfoDropdown title="Why are we asking this?">
              <Typography.Text color="neutralBase" size="footnote">
                This information is required to complete validation checks as part of joining Croatia. If this
                information changes later, you’ll be able to update it in the app.
              </Typography.Text>
            </MoreInfoDropdown>
            <FinancialForm />
          </Stack>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FinancialInformationScreen;

const styles = StyleSheet.create({
  container: {
    padding: spacing.regular,
  },
  headerContainer: {
    marginBottom: spacing.large,
    marginTop: spacing.medium,
  },
});
