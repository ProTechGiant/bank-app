import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface PillButtonProps extends Omit<PressableProps, "children" | "style"> {
  children?: string | React.ReactNode;
}

export default function PillButton({ children, ...restProps }: PillButtonProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette.complimentBase,
      borderRadius: theme.radii.xxlarge,
      borderColor: theme.palette.complimentBase,
      paddingHorizontal: theme.spacing.medium,
      paddingVertical: theme.spacing.small,
    }),
    []
  );

  return (
    <Pressable {...restProps} style={styles.containerBlock}>
      <View style={[styles.container, containerStyles]}>
        <Typography.Text color="neutralBase-30" size="body" weight="regular">
          {children}
        </Typography.Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  containerBlock: {
    alignSelf: "stretch",
  },
});
