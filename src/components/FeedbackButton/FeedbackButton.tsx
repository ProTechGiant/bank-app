import { cloneElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import Stack from "../Stack";

interface FeedbackButtonProps {
  onPress: () => void;
  icon: React.ReactElement<SvgProps>;
  text: string;
  subText?: string;
  topText?: string;
}

export default function FeedbackButton({ onPress, icon, text, subText, topText }: FeedbackButtonProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "column",
    gap: theme.spacing["12p"],
    justifyContent: "space-between",
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.medium,
    borderWidth: 1,
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["12p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <Stack direction="horizontal">
        {cloneElement(icon, { color: iconColor })}
        {topText ? (
          <View style={styles.topText}>
            <Typography.Text size="footnote" color="neutralBase" weight="regular">
              {topText}
            </Typography.Text>
          </View>
        ) : null}
      </Stack>
      <Stack direction="vertical">
        <Typography.Text size="callout" color="neutralBase+30" weight="medium">
          {text}
        </Typography.Text>
        {subText ? (
          <Typography.Text size="footnote" color="neutralBase+10" weight="regular">
            {subText}
          </Typography.Text>
        ) : null}
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topText: {
    alignItems: "flex-end",
    flexDirection: "column",
    flex: 1,
  },
});
