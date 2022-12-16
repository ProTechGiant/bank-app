import { Alert, Pressable, SafeAreaView, StyleSheet, View } from "react-native";

import MobileAndNationalIdForm from "@/components/Forms/MobileAndNationalId/MobileAndNationalIdForm";
import { palette, spacing } from "@/theme/values";
import Typography from "@/components/Typography";
import HideKeyboard from "@/helpers/HideKeyboard";
import ApplyCardHeader from "@/components/ApplyForCardHeader";

const IqamaInputScreen = () => {
  const ButtonPressed = () => {
    Alert.alert("signin button pressed");
  };

  return (
    <HideKeyboard>
      <SafeAreaView style={styles.container}>
        <ApplyCardHeader title="SIGN UP" backButton={true} />

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
      </SafeAreaView>
    </HideKeyboard>
  );
};
export default IqamaInputScreen;

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
