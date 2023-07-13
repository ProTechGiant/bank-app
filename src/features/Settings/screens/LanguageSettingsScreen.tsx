import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import Typography from "@/components/Typography";
import { useChangeLanguage } from "@/i18n";
import { useThemeStyles } from "@/theme";
enum LANGUAGES {
  AR = "ar",
  EN = "en",
}

export default function LanguageSettingsScreen() {
  const { i18n, t } = useTranslation("translation", { keyPrefix: "Settings.ChangeLanguageScreen" });
  const changeLanguage = useChangeLanguage();
  const [value, setValue] = useState(i18n.language);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const isSaveChangesButtonDisabled = value === i18n.language;

  const handleSaveChangesPress = () => {
    setIsAlertVisible(true);
    changeLanguage(value);
  };

  const pageStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "space-between",
    marginVertical: theme.spacing["32p"],
    marginHorizontal: theme.spacing["20p"],
  }));
  const frameContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["24p"],
  }));
  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["8p"],
  }));
  const radioButtonGroupStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["16p"],
  }));

  return (
    <Page>
      <NavHeader withBackButton={!isAlertVisible} />
      {isAlertVisible ? (
        <Alert
          end={<Alert.CloseEndButton onPress={() => setIsAlertVisible(false)} />}
          variant="success"
          message={t("successMessage")}
        />
      ) : null}
      <View style={pageStyle}>
        <View style={frameContainerStyle}>
          <View style={titleContainerStyle}>
            <Typography.Text size="title1" weight="medium">
              {t("title")}
            </Typography.Text>
            <Typography.Text size="callout" weight="regular" color="neutralBase+10">
              {t("subtitle")}
            </Typography.Text>
          </View>
          <RadioButtonGroup onPress={setValue} value={value} style={radioButtonGroupStyle}>
            <RadioButton value={LANGUAGES.EN} label={t("english")} />
            <RadioButton value={LANGUAGES.AR} label={t("arabic")} />
          </RadioButtonGroup>
        </View>
        <Button onPress={handleSaveChangesPress} disabled={isSaveChangesButtonDisabled}>
          {t("saveChanges")}
        </Button>
      </View>
    </Page>
  );
}
