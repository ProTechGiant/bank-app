import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Accordion from "@/components/Accordion";
import { LinkCard } from "@/components/LinkComponent";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
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

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={false}
        title={t("NafathAuthScreen.navHeaderTitle")}
        testID="Onboarding.NafathAuthScreen:NavHeader"
      />

      <View style={container}>
        <View style={headerContainerStyle}>
          <Typography.Text size="title1" weight="bold">
            {t("NafathAuthScreen.title")}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular">
            {t("NafathAuthScreen.subTitle")}
          </Typography.Text>
        </View>
        <Stack align="stretch" direction="vertical" gap="20p">
          <LinkCard onNavigate={handleNavigate} testID="Onboarding.NafathAuthScreen:SelectNafathAppButton">
            <Typography.Text size="callout" weight="medium" color="neutralBase+30">
              {t("NafathAuthScreen.appButtonTitle")}
              <Typography.Text weight="regular" size="footnote">
                {t("NafathAuthScreen.appButtonSubtitle")}
              </Typography.Text>
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase">
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
