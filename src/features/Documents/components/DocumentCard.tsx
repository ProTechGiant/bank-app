import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Radio from "@/components/Radio";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface DocumentCardInterface {
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
}

export default function DocumentCard({ title, description, isSelected, onSelect, icon }: DocumentCardInterface) {
  const documentCardStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["16p"],
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.palette["neutralBase-30"],
  }));

  return (
    <Pressable onPress={onSelect}>
      <Stack direction="horizontal" align="center" gap="16p" justify="space-between" style={documentCardStyle}>
        <View style={styles.iconContainerStyle}>{icon}</View>
        <Stack direction="vertical" align="flex-start" gap="4p" style={styles.documentCenterItemStyle}>
          <Typography.Text size="callout" weight="medium" color="neutralBase+30">
            {title}
          </Typography.Text>
          <Typography.Text size="footnote" weight="regular" color="neutralBase-10">
            {description}
          </Typography.Text>
        </Stack>
        <Radio isSelected={isSelected} onPress={onSelect} />
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  documentCenterItemStyle: {
    flex: 1,
  },
  iconContainerStyle: {
    height: "100%",
  },
});
