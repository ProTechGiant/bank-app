import { cloneElement } from "react";
import { Pressable, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import Stack from "../Stack";

interface IconActionButtonProps {
  active?: boolean;
  disabled?: boolean;
  label?: string;
  icon: React.ReactElement<SvgProps | IconProps>;
  onPress: () => void;
  testID?: string;
}

export default function IconActionButton({
  active = false,
  disabled = false,
  label,
  icon,
  onPress,
  testID,
}: IconActionButtonProps) {
  const iconContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-40"],
      minHeight: 114,
      flex: 1,
      maxWidth: 114,
      borderRadius: theme.radii.medium,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing["12p"],
      paddingVertical: theme.spacing["8p"],
    }),
    [active]
  );

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <Pressable style={iconContainerStyle} onPress={onPress} disabled={disabled} testID={testID}>
      <Stack direction="vertical" gap="12p" align="center">
        {cloneElement(icon, {
          color: iconColor,
        })}
        <Typography.Text
          size="footnote"
          weight="medium"
          color={disabled ? "neutralBase-30" : "neutralBase+30"}
          align="center">
          {label}
        </Typography.Text>
      </Stack>
    </Pressable>
  );
}
