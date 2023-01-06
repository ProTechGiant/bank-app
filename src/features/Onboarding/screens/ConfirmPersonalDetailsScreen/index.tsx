import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import MoreInfoDropdown from "../../components/MoreInfoDropdown";
import ConfirmPersonalDetailsForm from "./ConfirmPersonalDetailsForm";
import DetailsTile from "./DetailsTile";

export default function ConfirmPersonalDetailsScreen() {
  const footerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      height: "100%",
    }),
    []
  );
  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingBottom: theme.spacing.medium,
    }),
    []
  );
  const paddedViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flex: 1,
      marginBottom: 70,
      padding: theme.spacing.medium,
    }),
    []
  );
  const detailsTileStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.medium,
    }),
    []
  );

  return (
    <ScrollView style={{ marginTop: 32 }}>
      <NavHeader title="CONFIRMATION" backButton={true} />
      <View>
        <View style={paddedViewStyle}>
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={1} totalStep={6} />
          </View>
          <View style={headerStyle}>
            <Typography.Header size="large" weight="bold">
              Confirm your personal details
            </Typography.Header>
          </View>
          <View style={detailsTileStyle}>
            <DetailsTile />
          </View>
          <MoreInfoDropdown title="I need to change my details">
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              Visit
              <Typography.Text color="neutralBase" size="footnote" weight="bold">
                absher.sa
              </Typography.Text>
              to change your details. Please restart the process when your Absher profile has been updated. This can
              take up to 72 hours.
            </Typography.Text>
          </MoreInfoDropdown>
        </View>
        <View style={footerStyle}>
          <ConfirmPersonalDetailsForm />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  progressIndicator: {
    marginBottom: 44,
    marginTop: 12,
  },
});
