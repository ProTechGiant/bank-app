import { useTranslation } from "react-i18next";
import { StatusBar, useWindowDimensions, View, ViewStyle } from "react-native";

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
  const { height } = useWindowDimensions();

  const handleOnGetStartedPress = () => {
    navigation.navigate("GoalGetter.GoalDashboardScreen");
  };

  const headerSuccessStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginBottom: theme.spacing["16p"],
  }));

  const svgHeight = height * 0.55; // Adjust the height as needed
  const svgWidth = svgHeight * 0.9; // Adjust the aspect ratio as needed

  return (
    <Page>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <ContentContainer>
        <Stack direction="vertical" flex={1} justify="space-between" gap="24p" align="stretch">
          <View style={headerSuccessStyle}>
            <GoalGetterSuccessIcon height={svgHeight} width={svgWidth} />
            <Typography.Text size="xlarge" weight="bold">
              {t("GoalGetter.GoalCreatedSuccessfullyScreen.label")}
            </Typography.Text>
            <Typography.Text size="callout" weight="regular">
              {t("GoalGetter.GoalCreatedSuccessfullyScreen.subLabel")}
            </Typography.Text>
          </View>
        </Stack>
        <Button onPress={handleOnGetStartedPress}>
          <Typography.Text color="neutralBase-60">
            {t("GoalGetter.GoalCreatedSuccessfullyScreen.button")}
          </Typography.Text>
        </Button>
      </ContentContainer>
    </Page>
  );
}
