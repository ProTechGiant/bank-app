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

import SuccessfulOnboarding from "../assets/Mutual-Fund-Successful-Onboarding.svg";

export default function MutualFundSuccessfulOnboarding() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const handleOnPressDone = () => {
    navigation.navigate("MutualFund.MutualFundDetailsScreen");
  };

  const headerSuccessStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginBottom: theme.spacing["16p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    paddingBottom: theme.spacing["20p"],
  }));

  const svgHeight = height * 0.5;
  const svgWidth = svgHeight * 0.7;

  return (
    <Page
      backgroundColor="neutralBase-60"
      insets={["left", "right", "bottom", "top"]}
      testID="MutualFund.SuccessfulOnboarding:Page">
      <NavHeader
        withBackButton={false}
        testID="MutualFund.SuccessfulOnboarding:NavHeader"
        end={<NavHeader.CloseEndButton onPress={() => navigation.navigate("Home.DashboardScreen")} />}
      />
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <ContentContainer testID="MutualFund.SuccessfulOnboarding:ContentContainer">
        <Stack
          direction="vertical"
          flex={1}
          justify="space-between"
          gap="24p"
          align="stretch"
          testID="MutualFund.SuccessfulOnboarding:Stack">
          <View style={headerSuccessStyle}>
            <SuccessfulOnboarding height={svgHeight} width={svgWidth} />
            <Stack direction="vertical" align="center" gap="8p">
              <Typography.Text align="center" size="xlarge" weight="bold">
                {t("MutualFund.MutualFundSuccessfulOnboarding.title")}
              </Typography.Text>
              <Typography.Text align="center" size="callout" weight="bold">
                {t("MutualFund.MutualFundSuccessfulOnboarding.subTitle")}
              </Typography.Text>
            </Stack>
          </View>
        </Stack>
        <Stack gap="8p" direction="vertical" align="stretch" style={buttonContainerStyle}>
          <Button onPress={handleOnPressDone} testID="MutualFund.FundSuccessfulOnboarding:Button">
            {t("MutualFund.MutualFundSuccessfulOnboarding.buttonStartText")}
          </Button>
        </Stack>
      </ContentContainer>
    </Page>
  );
}
