import { useEffect, useState } from "react";
import { Alert, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import * as RNLocalize from "react-native-localize";

import Button from "@/components/Button";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { vh } from "@/theme/viewportUnit";

const OnboardingSplashScreen = () => {
  const bodyStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase-50"],
      fontSize: theme.typography.text.sizes.footnote,
      fontWeight: theme.typography.text.weights.regular,
      lineHeight: theme.typography.text._lineHeights.footnote,
      textAlign: "center",
    }),
    []
  );
  const buttonGroupStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginHorizontal: theme.spacing.regular,
      marginTop: "auto",
    }),
    []
  );
  const contentViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing.regular,
    }),
    []
  );
  const headerViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      marginBottom: theme.spacing.xlarge,
      marginTop: 18 * vh,
    }),
    []
  );
  const languageSelectViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      alignSelf: "flex-end",
      backgroundColor: theme.palette["neutralBase-50-12%"],
      borderRadius: theme.radii.medium,
      height: 34,
      justifyContent: "center",
      marginRight: theme.spacing.medium,
      marginTop: theme.spacing.large,
      paddingHorizontal: theme.spacing.medium,
      width: isEnglish ? 65 : 50,
    }),
    []
  );
  const signInContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      borderColor: theme.palette["neutralBase-50"],
      borderRadius: theme.radii.extraSmall,
      borderWidth: 1,
      height: 54,
      justifyContent: "center",
      marginTop: theme.spacing.small,
    }),
    []
  );

  const navigation = useNavigation();
  const [isEnglish, setIsEnglish] = useState(false);

  const ButtonPressed = () => {
    Alert.alert("signin button pressed");
  };

  let language: string;
  const LocalData = RNLocalize.getLocales();

  if (LocalData !== null) {
    const LangCode = LocalData[0].languageCode;
    LangCode === "ar" ? (language = "ar") : (language = "en");
  } else {
    language = "en";
  }

  useEffect(() => {
    if (language === "en") {
      setIsEnglish(true);
    }
  }, [language]);

  const handleOnContinueOnboarding = () => {
    navigation.navigate("Onboarding.Iqama");
  };

  const handleLanguageSwitch = () => {
    setIsEnglish(!isEnglish);
  };

  const buttonText = isEnglish ? "العربية" : "EN";

  return (
    <DarkOneGradient>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Pressable style={languageSelectViewStyle} onPress={handleLanguageSwitch}>
          <Typography.Text color="neutralBase-50" size="footnote">
            {buttonText}
          </Typography.Text>
        </Pressable>
        <View style={contentViewStyle}>
          <View style={headerViewStyle}>
            <Typography.Text size="large" weight="bold" color="neutralBase-50">
              You're in control now
            </Typography.Text>
          </View>
          <View>
            <Typography.Text size="footnote" weight="regular" color="neutralBase-50" style={bodyStyle}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eleifend commodo.
            </Typography.Text>
          </View>
        </View>
        <View style={buttonGroupStyle}>
          <Button variant="primary" color="alt" onPress={handleOnContinueOnboarding}>
            Sign up
          </Button>

          <Pressable onPress={ButtonPressed} style={signInContainerStyle}>
            <Typography.Text color="neutralBase-50" size="body" weight="regular">
              Sign in
            </Typography.Text>
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
});
