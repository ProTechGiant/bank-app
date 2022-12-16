import FinancialForm from "@/components/Forms/FinancialForm/FinancialForm";
import { Stack } from "@/components/Stack";
import Typography from "@/components/Typography";
import MoreInfoDropdown from "@/features/MoreInfoDropdown";
import { spacing } from "@/theme/values";
import { StatusBar, StyleSheet, SafeAreaView, View, ScrollView } from "react-native";

const FinancialInformationScreen = () => {
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Typography.Text size="large" weight="bold">
              Tell us abour your finances
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
        </View>
      </ScrollView>
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
  },
});
