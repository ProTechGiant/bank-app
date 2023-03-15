import { cloneElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface IconButtonProps {
  active?: boolean;
  activeLabel?: string;
  inactiveLabel: string;
  icon: React.ReactElement<SvgProps | IconProps>;
  onPress: () => void;
}

export default function IconButton({ active = false, activeLabel, inactiveLabel, icon, onPress }: IconButtonProps) {
  const iconContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: active ? theme.palette["primaryBase-10"] : theme.palette["neutralBase-40"],
      height: 56,
      width: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing["8p"],
    }),
    [active]
  );

  const iconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);
  const activeIconColor = useThemeStyles(theme => theme.palette["neutralBase-50"]);

  return (
    <View style={styles.buttonContainer}>
      <Pressable onPress={onPress}>
        <View style={iconContainerStyle}>{cloneElement(icon, { color: active ? activeIconColor : iconColor })}</View>
      </Pressable>
      <Typography.Text size="footnote" weight="medium">
        {active ? activeLabel : inactiveLabel}
      </Typography.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    width: 80,
  },
});
