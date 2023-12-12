import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import LockImage from "../assets/goal-lock-image.svg";

export default function GoalsEntryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleonCollectButtonPress = () => {
    // TODO will be add navigation once this screen ready
  };

  const handleonExtendButtonPress = () => {
    // TODO will be add navigation once this screen ready
  };

  const handleOnCloseIconPress = () => {
    navigation.navigate("GoalGetter.GoalsHubScreen");
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(_theme => ({
    flex: 1,
  }));

  const centeredImageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["48p"],
    paddingBottom: theme.spacing["32p"],
    justifyContent: "center",
    alignItems: "center",
  }));

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["64p"],
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <Page insets={["bottom", "left", "right"]} backgroundColor="neutralBase+30">
      <ContentContainer style={contentContainerStyle}>
        <NavHeader
          title=""
          withBackButton={false}
          variant="white"
          end={<NavHeader.CloseEndButton color="neutralBase-50" onPress={handleOnCloseIconPress} />}
        />
        <Stack direction="horizontal" justify="center" style={centeredImageContainerStyle}>
          <LockImage />
        </Stack>
        <Stack direction="vertical" justify="center" align="center" gap="8p">
          <Typography.Text size="xlarge" weight="bold" color="neutralBase-60">
            {t("GoalGetter.GoalsEntryScreen.title")}
          </Typography.Text>
          <Typography.Text size="callout" color="neutralBase-60">
            {t("GoalGetter.GoalsEntryScreen.message")}
          </Typography.Text>
        </Stack>
        <View style={buttonsContainerStyle}>
          <Button onPress={handleonCollectButtonPress}>{t("GoalGetter.GoalsEntryScreen.collect")}</Button>
        </View>
        <Stack direction="vertical" justify="center" align="center">
          <Pressable onPress={handleonExtendButtonPress}>
            <Typography.Text size="callout" weight="medium" color="neutralBase-60">
              {t("GoalGetter.GoalsEntryScreen.extendYourGoal")}
            </Typography.Text>
          </Pressable>
        </Stack>
      </ContentContainer>
    </Page>
  );
}
