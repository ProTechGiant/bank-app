import { cloneElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface IconButtonProps {
  changeBackgroundColor?: boolean;
  active?: boolean;
  disabled?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  icon: React.ReactElement<SvgProps | IconProps>;
  onPress: () => void;
  testID?: string;
}

export default function IconButton({
  changeBackgroundColor = false,
  active = false,
  disabled = false,
  activeLabel,
  inactiveLabel = "",
  icon,
  onPress,
  testID,
}: IconButtonProps) {
  const iconContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: changeBackgroundColor ? undefined : theme.palette.primaryBase,
      height: 56,
      width: 56,
      borderRadius: theme.radii.medium,
      borderColor: theme.palette["neutralBase-40"],
      borderWidth: changeBackgroundColor ? 1 : 0,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing["8p"],
    }),
    [active]
  );

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  return (
    <View style={styles.buttonContainer}>
      <Pressable onPress={onPress} disabled={disabled} testID={testID}>
        <View style={iconContainerStyle}>
          {cloneElement(
            icon,
            changeBackgroundColor
              ? undefined
              : {
                  color: iconColor,
                }
          )}
        </View>
      </Pressable>
      <Typography.Text
        align="center"
        size="footnote"
        weight="medium"
        color={disabled ? "neutralBase-30" : "neutralBase+30"}>
        {active ? activeLabel : inactiveLabel}
      </Typography.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    flex: 1,
  },
});
