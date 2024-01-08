import { cloneElement } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { Stack } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface QuickActionLinkProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  icon: React.ReactElement<SvgProps>;
  text: string;
  subText?: string;
  topText?: string;
}

export default function QuickActionLink({ onPress, style, icon, topText, text, subText }: QuickActionLinkProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["12p"],
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.medium,
    borderWidth: 1,
    height: 107,
  }));

  const iconStyle = useThemeStyles(theme => ({
    color: theme.palette["neutralBase+30"],
  }));

  return (
    <Pressable onPress={onPress} style={[style]}>
      <Stack direction="vertical" style={containerStyle} gap={subText ? "8p" : "32p"}>
        <View style={styles.iconTextContainer}>
          {cloneElement(icon, { color: iconStyle.color })}
          {topText ? (
            <View style={styles.topText}>
              <Typography.Text size="caption1" color="neutralBase">
                {topText}
              </Typography.Text>
            </View>
          ) : null}
        </View>
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="callout" color="neutralBase+30">
            {`${text}`}
          </Typography.Text>
          {subText ? (
            <Typography.Text size="footnote" color="neutralBase+10">
              {subText}
            </Typography.Text>
          ) : null}
        </Stack>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconTextContainer: {
    flexDirection: "row",
  },
  topText: {
    alignItems: "flex-end",
    flexDirection: "column",
    flex: 1,
  },
});
