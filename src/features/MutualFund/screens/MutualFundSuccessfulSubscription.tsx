import { useTranslation } from "react-i18next";
import { StatusBar, useWindowDimensions, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import GoalGetterCreated from "../assets/mutual-fund-subscription.svg";

export default function MutualFundSuccessfulSubscription() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const handleOnPressDone = () => {
    navigation.navigate("MutualFund.Dashboard");
  };

  const handleOnPressViewDetails = () => {
    navigation.navigate("MutualFund.MutualFundOrderDetailsScreen");
  };

  const headerSuccessStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginBottom: theme.spacing["16p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    paddingBottom: theme.spacing["20p"],
  }));

  const svgHeight = height * 0.55; // Adjust the height as needed
  const svgWidth = svgHeight * 0.75; // Adjust the aspect ratio as needed

  return (
    <Page backgroundColor="primaryBase">
      <NavHeader withBackButton={false} />
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <ContentContainer>
        <Stack direction="vertical" flex={1} justify="space-between" gap="24p" align="stretch">
          <View style={headerSuccessStyle}>
            <GoalGetterCreated height={svgHeight} width={svgWidth} />
            <Stack direction="vertical" align="center" gap="8p">
              <Typography.Text align="center" size="xlarge" weight="bold" color="neutralBase-60">
                {t("GoalGetter.GoalCreatedSuccessfullyScreen.label")}
              </Typography.Text>
            </Stack>
          </View>
        </Stack>
        <Stack gap="8p" direction="vertical" align="stretch" style={buttonContainerStyle}>
          <Button color="dark" onPress={handleOnPressDone}>
            {t("MutualFund.MutualFundSuccessfulSubscription.doneButton")}
          </Button>
          <Button color="dark" variant="tertiary" onPress={handleOnPressViewDetails}>
            {t("MutualFund.MutualFundSuccessfulSubscription.viewDetailsButton")}
          </Button>
        </Stack>
      </ContentContainer>
    </Page>
  );
}
