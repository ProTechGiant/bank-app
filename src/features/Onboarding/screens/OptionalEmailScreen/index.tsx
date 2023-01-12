import { ScrollView, View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import StayUpdatedEmailForm from "./StayUpdatedEmail/StayUpdatedEmailForm";

export default function OptionalEmailScreen() {
  const emailFormContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flex: 1,
      marginTop: theme.spacing.large,
    }),
    []
  );
  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.large,
    }),
    []
  );

  return (
    <Page>
      <NavHeader title="EMAIL" backButton={true}>
        <ProgressIndicator currentStep={2} totalStep={6} />
      </NavHeader>
      <ScrollView>
        <ContentContainer>
          <View style={{ flex: 1 }}>
            <View style={headerStyle}>
              <Typography.Header size="large" weight="bold">
                Stay updated
              </Typography.Header>
            </View>
            <Typography.Text size="footnote" weight="regular">
              Share your email and we’ll keep you up to date with what’s new.
            </Typography.Text>

            <View style={emailFormContainerStyle}>
              <StayUpdatedEmailForm />
            </View>
          </View>
        </ContentContainer>
      </ScrollView>
    </Page>
  );
}
