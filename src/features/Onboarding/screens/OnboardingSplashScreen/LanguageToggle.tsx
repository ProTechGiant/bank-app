import { useTranslation } from "react-i18next";
import { Pressable, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import useThemeStyles from "@/theme/use-theme-styles";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const languageSelectViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      alignSelf: "flex-end",
      backgroundColor: theme.palette["neutralBase-50-12%"],
      borderRadius: theme.radii.medium,
      height: 34,
      justifyContent: "center",
      marginHorizontal: theme.spacing.medium,
      marginTop: theme.spacing.large,
      paddingHorizontal: theme.spacing.medium,
      minWidth: 50,
    }),
    []
  );

  return (
    <Pressable
      style={[languageSelectViewStyle]}
      onPress={() => i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")}>
      <Typography.Text color="neutralBase-50" size="footnote">
        {i18n.language === "en" ? "العربية" : "EN"}
      </Typography.Text>
    </Pressable>
  );
};

export default LanguageToggle;
