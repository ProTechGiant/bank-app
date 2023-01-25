import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { TickCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function ApplePayActivatedScreen() {
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.largeTick, []);

  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnFinished = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  return (
    <DarkOneGradient>
      <Page>
        <NavHeader title="" backButton={false} color="white" rightComponent="close" />
        <ContentContainer>
          <Stack direction="vertical" justify="space-between" align="center">
            <View style={styles.iconContainer}>
              <TickCircleIcon width={iconDimensions} height={iconDimensions} />
            </View>
            <Typography.Text size="large" weight="bold" color="neutralBase-50">
              {t("ApplyCards.ApplePayActivatedScreen.title")}
            </Typography.Text>
          </Stack>
          <View style={styles.button}>
            <Button variant="primary" color="alt" block onPress={handleOnFinished}>
              <Typography.Text color="neutralBase-50">{t("ApplyCards.ApplePayActivatedScreen.button")}</Typography.Text>
            </Button>
          </View>
        </ContentContainer>
      </Page>
    </DarkOneGradient>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: "auto",
  },
  iconContainer: {
    paddingBottom: 35,
    paddingTop: 60,
  },
});
