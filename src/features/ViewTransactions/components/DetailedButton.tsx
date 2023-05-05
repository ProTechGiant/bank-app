import React from "react";
import { I18nManager, View, ViewStyle } from "react-native";

import { WithShadow } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { RightArrowIcon } from "../assets/icons";

interface DetailedButtonProps {
  label: string;
  text: string;
}

export default function DetailedButton({ label, text }: DetailedButtonProps) {
  const button = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing["10p"],
    paddingHorizontal: theme.spacing["16p"],
    height: 64,
    borderRadius: theme.radii.extraSmall,
  }));
  const margins = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["20p"],
  }));

  return (
    <View style={margins}>
      <WithShadow backgroundColor="neutralBase-50" borderRadius="extraSmall">
        <View style={button}>
          <View>
            <Typography.Text color="primaryBase" size="callout" weight="medium">
              {label}
            </Typography.Text>
            <Typography.Text color="neutralBase" size="caption2" weight="regular">
              {text}
            </Typography.Text>
          </View>
          <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
            <RightArrowIcon />
          </View>
        </View>
      </WithShadow>
    </View>
  );
}
