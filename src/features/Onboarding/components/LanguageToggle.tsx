import { useTranslation } from "react-i18next";
import { Pressable, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import useThemeStyles from "@/theme/use-theme-styles";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const handleOnPress = () => {
    const language = i18n.language === "en" ? "ar" : "en";
    setItemInEncryptedStorage("userSwitchedAppLanguage", language);
    i18n.changeLanguage(language);
  };

  const languageSelectViewStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+10"],
    borderRadius: theme.radii.medium,
    justifyContent: "center",
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
  }));

  return (
    <Pressable style={languageSelectViewStyle} onPress={handleOnPress}>
      <Typography.Text color="neutralBase-50" size="footnote">
        {i18n.language === "en" ? "العربية" : "EN"}
      </Typography.Text>
    </Pressable>
  );
}
