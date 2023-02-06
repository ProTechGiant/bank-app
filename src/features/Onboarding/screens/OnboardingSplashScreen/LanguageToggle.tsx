import { useTranslation } from "react-i18next";
import { Pressable, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import useThemeStyles from "@/theme/use-theme-styles";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const handleOnPress = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  const languageSelectViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      alignSelf: "flex-end",
      backgroundColor: theme.palette["neutralBase-50-12%"],
      borderRadius: theme.radii.medium,
      height: 34,
      justifyContent: "center",
      marginHorizontal: theme.spacing["16p"],
      marginTop: theme.spacing["24p"],
      paddingHorizontal: theme.spacing["16p"],
      minWidth: 50,
    }),
    []
  );

  return (
    <Pressable style={languageSelectViewStyle} onPress={handleOnPress}>
      <Typography.Text color="neutralBase-50" size="footnote">
        {i18n.language === "en" ? "العربية" : "EN"}
      </Typography.Text>
    </Pressable>
  );
}
