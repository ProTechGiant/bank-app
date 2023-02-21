import { useTranslation } from "react-i18next";
import { TextStyle, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function TermsAndConditionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const container = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing["20p"],
      paddingTop: theme.spacing["8p"],
    }),
    []
  );

  const TitleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing["16p"],
    }),
    []
  );

  const paragraphStyle = useThemeStyles<TextStyle>(
    theme => ({
      paddingVertical: theme.spacing["16p"],
    }),
    []
  );

  return (
    <Page>
      <NavHeader
        withBackButton={false}
        title={t("Referral.TermsAndConditionsScreen.navTitle")}
        end={
          <NavHeader.CloseEndButton
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
      />
      <View style={container}>
        <Typography.Header weight="bold" size="medium">
          {t("Referral.TermsAndConditionsScreen.pageTitle")}
        </Typography.Header>
        <Typography.Text size="callout" weight="semiBold" style={TitleStyle}>
          {t("Referral.TermsAndConditionsScreen.introductionTitle")}
        </Typography.Text>
        <Typography.Text size="footnote" weight="regular" style={paragraphStyle}>
          {t("Referral.TermsAndConditionsScreen.introductionContent")}
        </Typography.Text>
        <Typography.Text size="callout" weight="semiBold" style={TitleStyle}>
          {t("Referral.TermsAndConditionsScreen.intellectualPropertyRightsTitle")}
        </Typography.Text>
        <Typography.Text size="footnote" weight="regular" style={paragraphStyle}>
          {t("Referral.TermsAndConditionsScreen.intellectualPropertyRightsContent")}
        </Typography.Text>
      </View>
    </Page>
  );
}
