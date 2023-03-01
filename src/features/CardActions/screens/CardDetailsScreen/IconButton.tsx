import { cloneElement } from "react";
import { Pressable, View, ViewStyle } from "react-native";
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
  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    width: 80,
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: active ? theme.palette["primaryBase"] : theme.palette["neutralBase-30"],
      height: 56,
      width: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing["8p"],
    }),
    [active]
  );

  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);
  const activeIconColor = useThemeStyles(theme => theme.palette["neutralBase-50"]);

  return (
    <View style={buttonContainerStyle}>
      <Pressable onPress={onPress}>
        <View style={iconContainerStyle}>{cloneElement(icon, { color: active ? activeIconColor : iconColor })}</View>
      </Pressable>
      <Typography.Text size="footnote" weight="medium">
        {active ? activeLabel : inactiveLabel}
      </Typography.Text>
    </View>
  );
}
