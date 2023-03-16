import { cloneElement } from "react";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { ChevronRightIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ListItemLinkProps {
  disabled?: boolean;
  icon?: React.ReactElement<SvgProps>;
  title: string;
  onPress: () => void;
}

export default function ListItemLink({ icon, title, onPress, disabled = false }: ListItemLinkProps) {
  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
    height: 73,
  }));

  const disabledIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);
  const iconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);
  const chevronColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  return (
    <Pressable style={containerStyles} onPress={onPress} disabled={disabled}>
      {icon !== undefined && (
        <View style={styles.iconContainer}>
          {cloneElement(icon, { color: disabled ? disabledIconColor : iconColor })}
        </View>
      )}
      <View style={styles.titleContainer}>
        <Typography.Text color={disabled ? "neutralBase-30" : "neutralBase+30"} size="callout" weight="medium">
          {title}
        </Typography.Text>
      </View>
      <View style={[styles.arrow, { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }]}>
        <ChevronRightIcon color={chevronColor} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  arrow: {
    justifyContent: "center",
  },
  iconContainer: {
    justifyContent: "center",
    marginRight: 18,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
