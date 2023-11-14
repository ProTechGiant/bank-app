import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Toggle from "@/components/Toggle";
import { useThemeStyles } from "@/theme";

import { cardControlOptions } from "../mocks";

export default function CardSettings() {
  const { t } = useTranslation();
  const [options, setOptions] = useState(cardControlOptions);

  const handleToggle = (id: number) => {
    const newOptions = options.map(option => (option.id === id ? { ...option, isToggled: !option.isToggled } : option));
    setOptions(newOptions);
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
    <Stack direction="vertical" gap="24p" style={containerStyle}>
      <Typography.Text weight="medium" size="title3">
        {t("AllInOneCard.CardControlScreen.cardControl")}
      </Typography.Text>
      {options.map(item => (
        <View key={item.id}>
          <Stack direction="horizontal" justify="space-between" align="center" gap="8p" style={styles.container}>
            <View style={styles.optionView}>
              <Text style={titleTextStyles}>{t(`AllInOneCard.CardControlScreen.options.choice_${item.id}.title`)}</Text>
              <Text style={descriptionTextStyles}>
                {t(`AllInOneCard.CardControlScreen.options.choice_${item.id}.description`)}
              </Text>
            </View>
            <Toggle onPress={() => handleToggle(item.id)} value={item.isToggled} />
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
