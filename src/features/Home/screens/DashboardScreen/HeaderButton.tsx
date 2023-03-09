import { cloneElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface HeaderButtonProps {
  children?: string | React.ReactNode;
  iconStart: React.ReactElement<SvgProps | IconProps>;
  onPress: () => void;
}

export default function HeaderButton({ children, iconStart, onPress }: HeaderButtonProps) {
  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-10"],
    borderRadius: theme.radii.xxlarge,
    borderColor: theme.palette.complimentBase,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
    flexDirection: "row",
    alignItems: "center",
  }));

  const iconColor = useThemeStyles(theme => theme.palette["primaryBase-20"]);

  return (
    <Pressable onPress={onPress} style={containerStyles}>
      <View style={styles.icon}>{cloneElement(iconStart, { color: iconColor })}</View>
      <Typography.Text color="primaryBase-20" size="caption2" weight="regular">
        {children}
      </Typography.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginEnd: 8,
  },
});
