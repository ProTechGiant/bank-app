import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function LandingScreen() {
  const titleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: 120,
      paddingHorizontal: theme.spacing["16p"],
      textAlign: "center",
    }),
    []
  );
  const heroBrandStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["primaryBase-30"],
      alignItems: "center",
      justifyContent: "center",
      marginTop: theme.spacing["16p"],
      height: 86,
      width: "100%",
      borderRadius: theme.radii.extraSmall,
    }),
    []
  );

  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnPress = () => {
    navigation.navigate("SavingsGoals.SavingsGoalsScreen");
  };

  return (
    <Page backgroundColor="primaryBase">
      <NavHeader color="white" />
      <ContentContainer>
        <Stack direction="vertical" gap="16p" align="stretch">
          <View style={heroBrandStyle}>
            <Typography.Text color="primaryBase+30" weight="medium">
              HERO BRAND SCREEN
            </Typography.Text>
          </View>
          <Typography.Text color="neutralBase-50" size="large" weight="bold" style={titleStyle}>
            {t("SavingsGoals.LandingScreen.title")}
          </Typography.Text>
          <Typography.Text color="neutralBase-50" style={styles.text}>
            {t("SavingsGoals.LandingScreen.paragraphOne")}
          </Typography.Text>
          <Typography.Text color="neutralBase-50" style={styles.text}>
            {t("SavingsGoals.LandingScreen.paragraphTwo")}
          </Typography.Text>
        </Stack>
        <View style={styles.button}>
          <Button color="alt" block onPress={handleOnPress}>
            {t("SavingsGoals.LandingScreen.button")}
          </Button>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: "auto",
  },
  text: {
    textAlign: "center",
  },
});
