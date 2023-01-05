import { SafeAreaView, ScrollView, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Stack } from "@/components/Stack";
import Typography from "@/components/Typography";
import MoreInfoDropdown from "@/features/Onboarding/components/MoreInfoDropdown";
import FinancialForm from "@/features/Onboarding/screens/FinancialInformationScreen/FinancialForm/FinancialForm";
import { useThemeStyles } from "@/theme";

const FinancialInformationScreen = () => {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      padding: theme.spacing.regular,
    }),
    []
  );
  const headerContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.large,
      marginTop: theme.spacing.medium,
    }),
    []
  );

  return (
    <SafeAreaView>
      <NavHeader title="ABOUT YOU" backButton={true} barStyle="dark-content" />
      <View style={container}>
        <ProgressIndicator currentStep={3} totalStep={6} />
        <ScrollView>
          <View style={headerContainerStyle}>
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
