import React from "react";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import useThemeStyles from "@/theme/use-theme-styles";

import { RightIcon } from "../assets/icons";

interface SettingItemProps {
  label: string;
  icon: JSX.Element;
  onPress?: () => void;
}

export default function SettingItem({ label, icon, onPress }: SettingItemProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Pressable style={containerStyle} onPress={onPress}>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
