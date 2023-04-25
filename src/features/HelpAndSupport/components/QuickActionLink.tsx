import { cloneElement } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

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
    flexDirection: "column",
    alignItems: "flex-start",
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["12p"],
    gap: theme.spacing["16p"],
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.extraSmall,
    borderWidth: 1,
  }));

  const iconStyle = useThemeStyles(theme => ({
    color: theme.palette["primaryBase-40"],
  }));

  const textContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing["4p"],
  }));

  return (
    <Pressable onPress={onPress} style={[containerStyle, style]}>
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
      <View style={textContainerStyle}>
        <Typography.Text size="footnote" color="neutralBase+30">
          {text}
        </Typography.Text>
        {subText ? (
          <Typography.Text size="footnote" color="neutralBase-20">
            {subText}
          </Typography.Text>
        ) : null}
      </View>
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
