import { StackActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import { TextStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import CardComingSoonImage from "../assets/images/CardComingSoonImage.png";
import { numberOfDays } from "../mocks";

export default function CardComingSoonScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const containerStyle = useThemeStyles<TextStyle>(theme => ({
    marginVertical: theme.spacing["32p"],
  }));

  const handleCardSetting = () => {
    navigation.dispatch(StackActions.pop(5));
    navigation.navigate("AllInOneCard.SettingsScreen");
  };

  return (
    <Page backgroundColor="neutralBase+30" testID="AllInOneCard.CardComingSoonScreen:Page">
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <ContentContainer>
        <View style={styles.container}>
          <Stack flex={1} direction="vertical">
            <Stack direction="vertical" align="center">
              <Image
                resizeMode="contain"
                source={CardComingSoonImage}
                testID="AllInOneCard.CardComingSoonScreen:CardComingImage"
              />
              <Stack direction="vertical" align="center" gap="24p" justify="space-between" style={containerStyle}>
                <Typography.Header size="large" weight="bold" align="center" color="neutralBase-60">
                  {t("AllInOneCard.CardComingSoonScreen.title")}
                </Typography.Header>
                <Typography.Text size="callout" weight="regular" align="center" color="neutralBase-60">
                  {t("AllInOneCard.CardComingSoonScreen.subTitle", { days: numberOfDays })}
                </Typography.Text>
              </Stack>
            </Stack>
          </Stack>
          <Button
            color="dark"
            variant="primary"
            onPress={handleCardSetting}
            testID="AllInOneCard.CardComingSoonScreen:DoneButton">
            {t("AllInOneCard.CardComingSoonScreen.doneButton")}
          </Button>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
