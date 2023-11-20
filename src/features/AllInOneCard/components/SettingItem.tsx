import React from "react";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import useThemeStyles from "@/theme/use-theme-styles";

import { RightIcon } from "../assets/icons";

interface SettingItemProps {
  label: string;
  icon: JSX.Element;
}
export default function SettingItem({ label, icon }: SettingItemProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <View style={containerStyle}>
      <Stack direction="horizontal" justify="space-between" align="center" key={`${label}-${label}`}>
        <Stack direction="horizontal" gap="16p" align="center">
          {icon}
          <Typography.Text color="neutralBase+30" weight="medium" size="callout">
            {label}
          </Typography.Text>
        </Stack>
        <View style={styles.icon}>
          <RightIcon />
        </View>
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
