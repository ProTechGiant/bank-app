import { useState } from "react";
import { Alert, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

import Button from "@/components/Button";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import Typography from "@/components/Typography";
import { vh } from "@/helpers/viewportUnit";
import useNavigation from "@/navigation/use-navigation";
import { palette, radii, spacing, typography } from "@/theme/values";

const OnboardingSplashScreen = () => {
  const navigation = useNavigation();
  const [isEnglish, setIsEnglish] = useState(false);

  const ButtonPressed = () => {
    Alert.alert("signin button pressed");
  };

  const handleOnContinueOnboarding = () => {
    navigation.navigate("Onboarding.Iqama");
  };

  const handleLanguageSwitch = () => {
    setIsEnglish(!isEnglish);
  };

  const buttonText = isEnglish ? "EN" : "العربية";

  return (
    <DarkOneGradient>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Pressable style={styles.languageSelectView} onPress={handleLanguageSwitch}>
          <Text style={styles.languageText}>{buttonText}</Text>
        </Pressable>
        {/* </View> */}
        <View style={styles.contentView}>
          <View style={styles.headerView}>
            <Typography.Text size="large" weight="bold" color="neutralBase-50">
              You're in control now
            </Typography.Text>
          </View>
          <View>
            <Typography.Text size="footnote" weight="regular" color="neutralBase-50" style={styles.body}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eleifend commodo.
            </Typography.Text>
          </View>
        </View>
        <View style={styles.buttonGroup}>
          <Button variant="primary" color="alt" onPress={handleOnContinueOnboarding}>
            Sign up
          </Button>

          <Pressable onPress={ButtonPressed} style={styles.signInContainer}>
            <Text style={styles.signInText}>Sign in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </DarkOneGradient>
  );
};

export default OnboardingSplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  languageSelectView: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: palette["neutralBase-50-12%"],
    borderRadius: radii.medium,
    height: 34,
    justifyContent: "center",
    marginRight: spacing.medium,
    marginTop: spacing.large,
    paddingHorizontal: spacing.medium,
    width: 65,
  },
  languageText: {
    color: palette["neutralBase-50"],
    fontSize: typography.text.sizes.footnote,
    lineHeight: typography.text._lineHeights.footnote,
  },
  contentView: {
    paddingHorizontal: spacing.regular,
  },
  headerView: {
    alignItems: "center",
    marginBottom: spacing.xlarge,
    marginTop: 18 * vh,
  },
  body: {
    color: palette["neutralBase-50"],
    fontSize: typography.text.sizes.footnote,
    fontWeight: typography.text.weights.regular,
    lineHeight: typography.text._lineHeights.footnote,
    textAlign: "center",
  },
  buttonGroup: {
    position: "absolute",
    bottom: spacing.xlarge,
    left: spacing.large,
    right: spacing.large,
  },

  signInContainer: {
    alignItems: "center",
    borderColor: palette["neutralBase-50"],
    borderRadius: radii.extraSmall,
    borderWidth: 1,
    height: 54,
    justifyContent: "center",
    marginTop: spacing.small,
  },
  signInText: {
    color: palette["neutralBase-50"],
    fontSize: typography.text.sizes.body,
    fontWeight: typography.text.weights.regular,
    lineHeight: typography.text._lineHeights.body,
  },
});
