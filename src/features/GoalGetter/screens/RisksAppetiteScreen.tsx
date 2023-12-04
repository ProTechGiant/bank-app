import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { RiskAppetiteCard, Typography } from "@/components";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { DarkLockIcon, HighRiskIcon, LowRiskIcon, MediumRiskIcon, NoRiskIcon } from "../assets/icons";
import { HeaderTitle } from "../components";

export default function RisksAppetiteScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const colors = [
    useThemeStyles<string>(theme => theme.palette["successBase-30"]),
    useThemeStyles<string>(theme => theme.palette["interactionBase-30"]),
    useThemeStyles<string>(theme => theme.palette["warningBase-30"]),
    useThemeStyles<string>(theme => theme.palette["errorBase-30"]),
  ];
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
    flex: 1,
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader
        title={
          <View style={styles.screenTitleContainer}>
            <DarkLockIcon />
            <Typography.Text color="neutralBase+30" weight="medium" size="callout">
              {t("GoalGetter.RisksAppetiteScreen.title")}
            </Typography.Text>
          </View>
        }
        onBackPress={handleOnBackPress}
        withBackButton={false}
        end={<NavHeader.CloseEndButton onPress={handleOnBackPress} />}
      />
      <Stack direction="vertical" style={contentStyle} align="stretch" gap="16p">
        <HeaderTitle
          headerText={t("GoalGetter.RisksAppetiteScreen.headerText")}
          headerDescriptionText={t("GoalGetter.RisksAppetiteScreen.subTitle")}
        />
        <RiskAppetiteCard
          title={t("GoalGetter.RisksAppetiteScreen.noRiskCard.title")}
          subTitle={t("GoalGetter.RisksAppetiteScreen.noRiskCard.content")}
          color={colors[0]}
          icon={<NoRiskIcon />}
        />
        <RiskAppetiteCard
          title={t("GoalGetter.RisksAppetiteScreen.lowRiskCard.title")}
          subTitle={t("GoalGetter.RisksAppetiteScreen.lowRiskCard.content")}
          color={colors[1]}
          icon={<LowRiskIcon />}
        />
        <RiskAppetiteCard
          title={t("GoalGetter.RisksAppetiteScreen.mediumRiskCard.title")}
          subTitle={t("GoalGetter.RisksAppetiteScreen.mediumRiskCard.content")}
          color={colors[2]}
          icon={<MediumRiskIcon />}
        />
        <RiskAppetiteCard
          title={t("GoalGetter.RisksAppetiteScreen.highRiskCard.title")}
          subTitle={t("GoalGetter.RisksAppetiteScreen.highRiskCard.content")}
          color={colors[3]}
          icon={<HighRiskIcon />}
        />
      </Stack>
    </Page>
  );
}
const styles = StyleSheet.create({
  screenTitleContainer: { alignItems: "center", flexDirection: "row" },
});
