import { ScrollView, View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import MoreInfoDropdown from "@/features/Onboarding/components/MoreInfoDropdown";
import FinancialForm from "@/features/Onboarding/screens/FinancialInformationScreen/FinancialForm/FinancialForm";
import { useThemeStyles } from "@/theme";

export default function FinancialInformationScreen() {
  const headerContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.large,
    }),
    []
  );

  return (
    <Page>
      <NavHeader title="ABOUT YOU" backButton={true} barStyle="dark-content">
        <ProgressIndicator currentStep={3} totalStep={6} />
      </NavHeader>
      <ScrollView>
        <ContentContainer>
          <View style={headerContainerStyle}>
            <Typography.Text size="large" weight="bold">
              Tell us about your finances
            </Typography.Text>
          </View>
          <Stack direction="vertical" gap="large">
            <MoreInfoDropdown title="Why are we asking this?">
              <Typography.Text color="neutralBase" size="footnote">
                This information is required to complete validation checks as part of joining Croatia. If this
                information changes later, you’ll be able to update it in the app.
              </Typography.Text>
            </MoreInfoDropdown>
            <FinancialForm />
          </Stack>
        </ContentContainer>
      </ScrollView>
    </Page>
  );
}
