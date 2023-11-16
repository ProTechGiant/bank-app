import { useTranslation } from "react-i18next";
import { StatusBar, useWindowDimensions, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import GoalGetterCreated from "../assets/goal-getter-created.svg";

export default function GoalGetterScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const handleOnPressClose = () => {
    navigation.navigate("Home.HomeTabs");
  };

  const handleOnPressCreateGoal = () => {
    navigation.navigate("GoalGetter.ShapeGoalScreen");
  };

  const handleOnPressExploreProducts = () => {
    navigation.navigate("GoalGetter.GoalDashboardScreen");
  };

  const headerSuccessStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginBottom: theme.spacing["16p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    paddingBottom: theme.spacing["20p"],
  }));

  const svgHeight = height * 0.4; // Adjust the height as needed
  const svgWidth = svgHeight * 0.6; // Adjust the aspect ratio as needed

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={t("GoalGetter.GoalGetterScreen.title")}
        withBackButton={false}
        end={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={handleOnPressClose} />}
      />
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <ContentContainer>
        <Stack direction="vertical" flex={1} justify="space-between" gap="24p" align="stretch">
          <View style={headerSuccessStyle}>
            <GoalGetterCreated height={svgHeight} width={svgWidth} />
            <Stack direction="vertical" align="center" gap="12p">
              <Typography.Text align="center" size="body" weight="bold" color="neutralBase+30">
                {t("GoalGetter.GoalGetterScreen.whereToNext")}
              </Typography.Text>
              <Typography.Text align="center" size="callout" weight="regular" color="neutralBase+10">
                {t("GoalGetter.GoalGetterScreen.hopesAndDreams")}
              </Typography.Text>
            </Stack>
          </View>
        </Stack>
        <Stack direction="vertical" align="stretch" gap="12p">
          <Typography.Text align="center" size="large" weight="bold" color="neutralBase+30">
            {t("GoalGetter.GoalGetterScreen.title")}
          </Typography.Text>
          <Stack gap="8p" direction="vertical" align="stretch" style={buttonContainerStyle}>
            <Button onPress={handleOnPressCreateGoal}>
              <Typography.Text align="center" size="body" weight="regular" color="neutralBase-60">
                {t("GoalGetter.GoalGetterScreen.createGoalbutton")}
              </Typography.Text>
            </Button>
            <Button variant="tertiary" onPress={handleOnPressExploreProducts}>
              <Typography.Text align="center" size="body" weight="medium" color="neutralBase+30">
                {t("GoalGetter.GoalGetterScreen.exploreProductsbutton")}
              </Typography.Text>
            </Button>
          </Stack>
        </Stack>
      </ContentContainer>
    </Page>
  );
}
