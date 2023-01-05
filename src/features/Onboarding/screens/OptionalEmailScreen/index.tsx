import { SafeAreaView, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
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
      marginTop: theme.spacing.regular,
    }),
    []
  );
  const innerViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flex: 1,
      marginHorizontal: theme.spacing.large,
    }),
    []
  );
  const progressIndicatorStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing.large,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader title="EMAIL" backButton={true} />
      <ScrollView>
        <View style={innerViewStyle}>
          <View style={progressIndicatorStyle}>
            <ProgressIndicator currentStep={2} totalStep={6} />
          </View>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
