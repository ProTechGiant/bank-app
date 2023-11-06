import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import CheckBoxCheckedIcon from "@/assets/icons/CheckBoxCheckedIcon";
import CheckBoxIcon from "@/assets/icons/CheckBoxIcon";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ContributionMethodSectionProps {
  icon: React.ReactNode;
  optionKey: string;
  texts: string[];
  isSelected: boolean;
  toggleOption: (optionKey: string) => void;
}

export default function ContributionMethodSection({
  icon,
  optionKey,
  texts,
  isSelected,
  toggleOption,
}: ContributionMethodSectionProps) {
  const textContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginHorizontal: theme.spacing["8p"],
  }));

  const optionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing["12p"],
    marginVertical: theme.spacing["12p"],
  }));

  return (
    <Pressable onPress={() => toggleOption(optionKey)} style={optionContainerStyle}>
      <View style={styles.rowCenter}>
        {icon}
        <View style={textContainerStyle}>
          {texts.map((text, index) => (
            <Typography.Text key={index}>{text}</Typography.Text>
          ))}
        </View>
      </View>
      {isSelected ? <CheckBoxCheckedIcon /> : <CheckBoxIcon />}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  rowCenter: {
    alignItems: "center",
    flexDirection: "row",
  },
});
