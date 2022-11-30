import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import Button from "@/components/Button";
import LanguageDropdown from "@/components/LanguageSelector";
import { vh, vw } from "@/helpers/viewportUnit";
import useNavigation from "@/navigation/use-navigation";
import { palette, spacing, typography } from "@/theme/values";

const OnboardingSplashScreen = () => {
  const navigation = useNavigation();

  // Sign In page not in this scope
  // const handleOnSignIn = () => {
  //   navigation.navigate("Onboarding.SignIn");
  // };
  const ButtonPressed = () => {
    Alert.alert("signin button pressed");
  };

  const handleOnContinueOnboarding = () => {
    navigation.navigate("Onboarding.Iqama");
  };

  return (
    // styles need to be re done when branding changes
    <SafeAreaView style={styles.container}>
      <View style={styles.dropdownView}>
        <LanguageDropdown />
      </View>

      <View style={styles.contentView}>
        <View style={styles.headerView}>
          <Text style={styles.header}>Smarter lifestyle choices with more control</Text>
        </View>
        <View style={styles.bodyView}>
          <Text style={styles.body}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eleifend commodo.
          </Text>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <Button onPress={handleOnContinueOnboarding}>Sign Up</Button>
        <View style={styles.subButtonView}>
          <Text style={styles.subButtonText}>Already have a Croatia account? </Text>
          <Pressable onPress={ButtonPressed}>
            <Text style={styles.signInLink}>Sign in here</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingSplashScreen;

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },

  dropdownView: {
    alignItems: "flex-end",
    marginRight: spacing.medium,
    marginTop: spacing.large,
  },
  contentView: {
    marginLeft: spacing.large,
    width: 71 * vw,
  },
  headerView: {
    marginBottom: spacing.xlarge,
    marginTop: 18 * vh,
  },
  header: {
    color: palette["neutralBase+30"],
    fontSize: typography.header.sizes.medium,
    fontWeight: typography.header.weights.extraBold,
    lineHeight: typography.header._lineHeights.large,
  },
  body: {
    fontSize: typography.text.sizes.footnote,
    fontWeight: typography.text.weights.regular,
    lineHeight: typography.text._lineHeights.footnote,
  },
  buttonGroup: {
    marginHorizontal: spacing.large,
    top: 31 * vh,
  },
  subButtonView: {
    alignSelf: "center",
    flexDirection: "row",
    marginTop: spacing.large,
  },
  subButtonText: {
    fontSize: typography.text.sizes.footnote,
    lineHeight: typography.text._lineHeights.footnote,
  },
  signInLink: {
    color: palette.interactionBase,
  },
});
