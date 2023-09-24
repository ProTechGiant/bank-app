import { cloneElement } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

import Radio from "@/components/Radio";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { iconMapping } from "@/utils/icon-mapping";

import { PredefinedOption } from "../types";

export interface PredefinedOptionCardProps {
  predefinedOption: PredefinedOption;
  isSelected: boolean;
  onPress?: () => void;
  value?: number;
}

export default function PredefinedOptionCard({ predefinedOption, isSelected, onPress }: PredefinedOptionCardProps) {
  const selectionCardStackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["16p"],
    borderRadius: theme.spacing["8p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" style={selectionCardStackStyle} justify="space-between" align="center">
        <Stack direction="horizontal" gap="16p">
          {cloneElement(iconMapping.goalGetter[predefinedOption.Icon] ?? iconMapping.homepageQuickActions.croatiaIcon, {
            height: 24,
            color: iconColor,
            width: 24,
          })}
          <Stack direction="vertical" gap="4p" style={style.nameAndDescriptionStack}>
            <Typography.Text size="callout" weight="medium" color="neutralBase+30">
              {predefinedOption.Name}
            </Typography.Text>
            <Typography.Text size="footnote" weight="regular" color="neutralBase-10">
              {predefinedOption.Description}
            </Typography.Text>
          </Stack>
        </Stack>
        <Radio isSelected={isSelected} />
      </Stack>
    </Pressable>
  );
}

const style = StyleSheet.create({
  nameAndDescriptionStack: {
    width: "80%",
  },
});
