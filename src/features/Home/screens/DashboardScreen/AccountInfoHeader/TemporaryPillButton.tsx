import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TemporaryPillButtonProps extends Omit<PressableProps, "children" | "style"> {
  children?: string | React.ReactNode;
  iconLeft?: React.ReactNode;
}

export default function TemporaryPillButton({ children, iconLeft, ...restProps }: TemporaryPillButtonProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50-12%"],
      borderRadius: theme.radii.xxlarge,
      borderColor: theme.palette.complimentBase,
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
      flexDirection: "row",
      alignItems: "center",
    }),
    []
  );

  return (
    <Pressable {...restProps}>
      <View style={containerStyles}>
        {undefined !== iconLeft && <View style={styles.icon}>{iconLeft}</View>}
        <Typography.Text color="primaryBase-30" size="caption2" weight="regular">
          {children}
        </Typography.Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginHorizontal: 8,
  },
});
