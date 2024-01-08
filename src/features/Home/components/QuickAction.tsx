import { cloneElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";
import { iconMapping } from "@/utils/icon-mapping";

interface QuickActionProps {
  color: keyof Theme["palette"];
  backgroundColor?: keyof Theme["palette"];
  title?: string;
  iconName?: string;
  onPress?: () => void;
  testID?: string;
  states?: "Enabled" | "Selected" | "Pressed" | "Placeholder";
  borederRaduisSize?: "xlarge" | "medium";
}

export default function QuickAction({
  color,
  iconName,
  title,
  backgroundColor = "supportBase-10",
  states = "Enabled",
  onPress,
  borederRaduisSize = "medium",
}: QuickActionProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    alignItems: "center",
    flex: 1,
  }));

  backgroundColor = states === "Enabled" ? backgroundColor : states === "Pressed" ? "neutralBase+30" : "neutralBase-40";
  const iconBackgroundColor = useThemeStyles(theme => theme.palette[backgroundColor], [backgroundColor]);

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    backgroundColor: iconBackgroundColor,
    borderRadius: theme.radii[borederRaduisSize],
  }));

  const rawColor = useThemeStyles(theme => theme.palette[color], [color]);

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <View style={iconStyle}>
        {cloneElement(iconMapping.homepageQuickActions[`${iconName}`] ?? iconMapping.homepageQuickActions.croatiaIcon, {
          color: rawColor,
          height: 24,
          width: 24,
        })}
      </View>
      {title !== undefined && states !== "Placeholder" && states !== "Selected" ? (
        <Typography.Text
          color="neutralBase+30"
          size="footnote"
          weight="medium"
          align="center"
          style={styles.titleStyle}>
          {title}
        </Typography.Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    textTransform: "capitalize",
  },
});
