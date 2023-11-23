import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Toggle from "@/components/Toggle";
import { useThemeStyles } from "@/theme";

import { useEditControlSettings } from "../hooks/query-hooks";
import { EditControlSettings, Restriction } from "../types";

interface CardManagementProps {
  settings: Restriction[];
}

export default function CardSettings({ settings }: CardManagementProps) {
  const { t } = useTranslation();
  const [options, setOptions] = useState<Restriction[]>(settings);
  const editSettings = useEditControlSettings({ cardId: "40545400183678185477" }); //TODO :Will make it dynamic after api integration

  const handleToggle = async (RestrictionType: string) => {
    const restriction = options.find(option => option.RestrictionType === RestrictionType);
    const newOptions = options.map(option =>
      option.RestrictionType === RestrictionType ? { ...option, RestrictionFlag: !option.RestrictionFlag } : option
    );
    const newSettings: EditControlSettings = {};
    switch (restriction?.RestrictionType) {
      case "PERS_RESTR_CONTACTLESS":
        newSettings.ContactlessPayments = !restriction.RestrictionFlag;
        break;
      case "ECOM":
        newSettings.OnlinePayments = !restriction.RestrictionFlag;
        break;
      case "ATM":
        newSettings.AtmWithdrawals = !restriction.RestrictionFlag;
        break;
      case "NFC":
        newSettings.POSPayments = !restriction.RestrictionFlag;
        break;
    }
    setOptions(newOptions);
    editSettings.mutateAsync(newSettings);
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: theme.spacing["20p"],
  }));
  const titleTextStyles = useThemeStyles<TextStyle>(theme => ({
    color: "#1E1A25",
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.medium,
    lineHeight: theme.typography.text._lineHeights.callout,
  }));
  const descriptionTextStyles = useThemeStyles<TextStyle>(theme => ({
    color: "#78758A",
    fontSize: theme.typography.text.sizes.footnote,
    lineHeight: theme.typography.text._lineHeights.footnote,
  }));

  return (
    <Stack direction="vertical" gap="24p" style={containerStyle} testID="AllInOneCard.CardControlScreen:Stack">
      <Typography.Text weight="medium" size="title3">
        {t("AllInOneCard.CardControlScreen.cardControl")}
      </Typography.Text>
      {options.map(item => (
        <View key={item.RestrictionType}>
          <Stack direction="horizontal" justify="space-between" align="center" gap="8p" style={styles.container}>
            <View style={styles.optionView}>
              <Text style={titleTextStyles}>{item.RestrictionDisplayName}</Text>
              <Text style={descriptionTextStyles}>{item.RestrictionDescription}</Text>
            </View>
            <Toggle
              onPress={() => handleToggle(item.RestrictionType)}
              value={item.RestrictionFlag}
              testID="AllInOneCard.CardControlScreen:toggle"
            />
          </Stack>
        </View>
      ))}
    </Stack>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  optionView: {
    width: "80%",
  },
});
