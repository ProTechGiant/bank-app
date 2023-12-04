import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, StatusBar, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { GoalGetterSuccessIcon } from "../assets/icons";

export default function GoalCreatedSuccessfullyScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnGetStartedPress = () => {
    navigation.navigate("GoalGetter.GoalDashboardScreen");
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    marginVertical: theme.spacing["48p"],
  }));

  const textContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["64p"],
  }));

  return (
    <Page backgroundColor="neutralBase+30">
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <ContentContainer>
        <Stack direction="vertical" flex={1} justify="space-between" gap="24p" align="center" style={contentStyle}>
          <GoalGetterSuccessIcon />
          <View style={textContainerStyle}>
            <Typography.Text size="xlarge" weight="bold" color="neutralBase-60">
              {t("GoalGetter.GoalCreatedSuccessfullyScreen.label")}
            </Typography.Text>
            <Typography.Text size="callout" weight="regular" color="neutralBase-60">
              {t("GoalGetter.GoalCreatedSuccessfullyScreen.subLabel")}
            </Typography.Text>
          </View>
        </Stack>
        <Button onPress={handleOnGetStartedPress} color="dark">
          <Typography.Text>{t("GoalGetter.GoalCreatedSuccessfullyScreen.button")}</Typography.Text>
        </Button>
      </ContentContainer>
    </Page>
  );
}
