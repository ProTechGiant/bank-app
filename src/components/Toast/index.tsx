import { StyleSheet, Text, View } from "react-native";

import Typography from "@/components/Typography";
import { palette, radii, spacing, typography } from "@/theme/values";

interface ToastProps {
  borderPosition?: "left" | "right";
  title?: string;
  content?: string;
  variant?: "compliment" | "success" | "error" | "primary";
  children?: React.ReactNode;
}

export default function Toast({ borderPosition, title, content, children, variant }: ToastProps) {
  return (
    <View
      style={[
        styles.container,
        borderPosition === "left" && styles.borderLeft,
        borderPosition === "right" && styles.borderRight,
        variant === "compliment" && styles.themeCompliment,
        variant === "error" && styles.themeError,
        variant === "primary" && styles.themePrimary,
        variant === "success" && styles.themeSuccess,
      ]}>
      {title && (
        <View style={styles.titleContainer}>
          <Typography.Text size="footnote" weight="semiBold">
            {title}
          </Typography.Text>
        </View>
      )}
      {content && <Text style={styles.content}>{content}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  borderLeft: {
    borderLeftWidth: 4,
  },
  borderRight: {
    borderRightWidth: 4,
  },
  container: {
    backgroundColor: palette["neutralBase+50"],
    borderRadius: radii.extraSmall,
    padding: spacing.medium,
  },
  content: {
    fontSize: typography.text.sizes.caption1,
    lineHeight: typography.text._lineHeights.caption1,
  },
  themeCompliment: {
    borderColor: palette["complimentBase"],
  },
  themeError: {
    borderColor: palette["errorBase"],
  },
  themePrimary: {
    borderColor: palette["primaryBase"],
  },
  themeSuccess: {
    borderColor: palette["complimentSuccess"],
  },
  titleContainer: {
    marginBottom: spacing.small,
  },
});
