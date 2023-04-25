import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { ChevronRightIcon } from "@/assets/icons";
import { Theme, useThemeStyles } from "@/theme";

import Typography from "@/components/Typography";
import IconLink from "./IconLink";

interface LinkListProps {
  children: string;
  icon: React.ReactElement<SvgProps>;
  iconColor?: keyof Theme["palette"];
  linkColor?: keyof Theme["palette"];
  linkTextEnd?: string;
  onPress: () => void;
}

export default function LinkList({
  onPress,
  icon,
  iconColor,
  linkColor = "neutralBase+30",
  linkTextEnd,
  children,
}: LinkListProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing["16p"],
    width: "100%",
  }));

  const endContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing["8p"],
  }));

  const chevronColor = useThemeStyles(theme => theme.palette["neutralBase-30"]);

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <IconLink onPress={onPress} icon={icon} iconColor={iconColor} linkColor={linkColor}>
        {children}
      </IconLink>
      <View style={endContainerStyle}>
        {linkTextEnd ? (
          <Typography.Text weight="medium" size="callout" color="neutralBase+30">
            {linkTextEnd}
          </Typography.Text>
        ) : null}
        <View style={styles.chevron}>
          <ChevronRightIcon color={chevronColor} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chevron: {
    alignSelf: "center",
    transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }],
  },
});
