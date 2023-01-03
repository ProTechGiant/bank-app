import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import MobileAndNationalIdForm from "./MobileAndNationalId/MobileAndNationalIdForm";

import { palette, spacing } from "@/theme/values";
import Typography from "@/components/Typography";
import NavHeader from "@/components/NavHeader";

export default function IqamaInputScreen() {
  const ButtonPressed = () => {
    Alert.alert("signin button pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavHeader title="SIGN UP" backButton={true} barStyle="dark-content" />
      <ScrollView>
        <View style={styles.headerView}>
          <Typography.Text size="large" weight="bold" style={styles.headerTitle}>
            Let's go
          </Typography.Text>

          <Typography.Text size="callout" weight="regular">
            Let's start with your contact and ID details:
          </Typography.Text>
        </View>
        <View style={styles.body}>
          <MobileAndNationalIdForm />
          <View style={styles.accountSignIn}>
            <Typography.Text size="callout" weight="regular">
              Already with us?
            </Typography.Text>
            <Pressable onPress={ButtonPressed}>
              <Typography.Text size="callout" weight="regular" color="tintBase">
                {" "}
                Sign in here
              </Typography.Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette["neutralBase-40"],
  },
  headerView: {
    marginBottom: spacing.large,
    marginHorizontal: spacing.medium,
  },
  headerTitle: {
    marginVertical: spacing.large,
  },
  body: {
    marginHorizontal: spacing.medium,
  },
  accountSignIn: {
    alignSelf: "center",
    flexDirection: "row",
    marginTop: spacing.small,
  },
});
