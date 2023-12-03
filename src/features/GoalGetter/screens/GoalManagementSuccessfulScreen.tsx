import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { StatusBar, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { GoalGetterStackParams } from "../GoalGetterStack";

export default function GoalManagementSuccessfulScreen() {
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.GoalManagementSuccessfulScreen">>();
  const navigation = useNavigation();

  const headerSuccessStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginTop: theme.spacing["64p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["64p"],
    paddingBottom: theme.spacing["20p"],
  }));
  const onViewGoal = () => {
    navigation.navigate("GoalGetter.GoalsHubScreens");
  };
  const onViewTransactions = () => {
    // TODO will be nagigate when the next screen created
    // navigation.navigate("");
  };

  return (
    <Page backgroundColor="neutralBase+30">
      <NavHeader title={t("GoalGetter.GoalGetterScreen.title")} withBackButton={false} />
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
      <ContentContainer>
        <Stack direction="vertical" flex={1} justify="space-between" gap="24p" align="stretch">
          <View style={headerSuccessStyle}>{params.icon}</View>
          <Stack direction="vertical" align="stretch" gap="64p">
            <Stack direction="vertical" align="center" gap="8p">
              <Typography.Text align="center" size="brand" weight="bold" color="neutralBase-60">
                {params.title}
              </Typography.Text>
              <Typography.Text align="center" size="callout" weight="regular" color="neutralBase-60">
                {params.subtitle}
              </Typography.Text>
            </Stack>
            <Stack gap="8p" direction="vertical" align="stretch" style={buttonContainerStyle}>
              <Button
                color="dark"
                onPress={() => {
                  onViewGoal();
                }}>
                <Typography.Text align="center" size="body" weight="medium" color="neutralBase+30">
                  {t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.button")}
                </Typography.Text>
              </Button>
              {params.viewTransactions && (
                <Button
                  variant="tertiary"
                  onPress={() => {
                    onViewTransactions();
                  }}>
                  <Typography.Text align="center" size="body" weight="medium" color="neutralBase-60">
                    {t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.viewTransaction")}
                  </Typography.Text>
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      </ContentContainer>
    </Page>
  );
}
