import { useTranslation } from "react-i18next";
import { TextStyle, View } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

const Declaration = () => {
  const { t } = useTranslation();

  const headingStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginBottom: theme.spacing["8p"],
  }));

  const paragraphStyle = useThemeStyles<TextStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  return (
    <View>
      <View>
        <Typography.Text size="footnote" weight="semiBold" color="primaryBase" style={headingStyle}>
          {t("Onboarding.TermsAndConditions.declarations.sectionOne.title")}
        </Typography.Text>
        <Typography.Text size="caption1" weight="regular" style={paragraphStyle}>
          {t("Onboarding.TermsAndConditions.declarations.sectionOne.bodyOne")}
        </Typography.Text>
        <Typography.Text size="caption1" weight="regular" style={paragraphStyle}>
          {t("Onboarding.TermsAndConditions.declarations.sectionOne.bodyTwo")}
        </Typography.Text>
        <Typography.Text size="caption1" weight="regular" style={paragraphStyle}>
          {t("Onboarding.TermsAndConditions.declarations.sectionOne.bodyThree")}
        </Typography.Text>
      </View>
      <View>
        <Typography.Text size="footnote" weight="semiBold" color="primaryBase" style={headingStyle}>
          {t("Onboarding.TermsAndConditions.declarations.sectionTwo.title")}
        </Typography.Text>
        <Typography.Text size="caption1" weight="regular" style={paragraphStyle}>
          {t("Onboarding.TermsAndConditions.declarations.sectionTwo.bodyOne")}
        </Typography.Text>
        <Typography.Text size="caption1" weight="regular" style={paragraphStyle}>
          {t("Onboarding.TermsAndConditions.declarations.sectionTwo.bodyTwo")}
        </Typography.Text>
      </View>
    </View>
  );
};

export default Declaration;
