import { useTranslation } from "react-i18next";
import { TextStyle, View, ViewStyle } from "react-native";

import Accordion from "@/components/Accordion";
import { LinkCard } from "@/components/LinkComponent";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Tag from "@/components/Tag";
import Typography from "@/components/Typography";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function NafathAuthScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();

  const handleNavigate = () => {
    navigation.navigate("Onboarding.NafathCode");
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["24p"],
    flex: 1,
  }));

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
    marginTop: theme.spacing["16p"],
    gap: theme.spacing["8p"],
  }));

  const subTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    width: "80%",
  }));

  const tagContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={true}
        title={t("NafathAuthScreen.navHeaderTitle")}
        testID="Onboarding.NafathAuthScreen:NavHeader"
      />

      <View style={container}>
        <View style={headerContainerStyle}>
          <Typography.Text size="title1" weight="medium">
            {t("NafathAuthScreen.title")}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular">
            {t("NafathAuthScreen.subTitle")}
          </Typography.Text>
        </View>
        <Stack align="stretch" direction="vertical" gap="20p">
          <LinkCard onNavigate={handleNavigate} testID="Onboarding.NafathAuthScreen:SelectNafathAppButton">
            <View style={tagContainerStyle}>
              <Tag title="Nafath app" variant="pink" />
            </View>
            <Typography.Text size="callout" weight="medium" color="neutralBase+30">
              {t("NafathAuthScreen.appButtonTitle")}
              {t("NafathAuthScreen.appButtonSubtitle")}
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase" style={subTextStyle}>
              {t("NafathAuthScreen.appButtonBody")}
            </Typography.Text>
          </LinkCard>
          <Accordion title={t("NafathAuthScreen.dropdownTitle")}>
            <Typography.Text color="neutralBase+10" size="footnote">
              {t("NafathAuthScreen.dropdownBody")}
            </Typography.Text>
          </Accordion>
        </Stack>
      </View>
    </Page>
  );
}
