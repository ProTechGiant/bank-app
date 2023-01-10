import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InfoBoxProps {
  borderPosition?: "left" | "right";
  title?: string;
  content?: string;
  variant?: "compliment" | "success" | "error" | "primary";
  children?: React.ReactNode;
}

export default function InfoBox({ borderPosition, title, content, children, variant }: InfoBoxProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      borderRadius: theme.radii.extraSmall,
      padding: theme.spacing.medium,
    }),
    []
  );
  const themeComplimentStyle = useThemeStyles<TextStyle>(
    theme => ({
      borderColor: theme.palette["complimentBase"],
    }),
    []
  );
  const themeErrorStyle = useThemeStyles<TextStyle>(
    theme => ({
      borderColor: theme.palette["errorBase"],
    }),
    []
  );
  const themePrimaryStyle = useThemeStyles<TextStyle>(
    theme => ({
      borderColor: theme.palette["primaryBase"],
    }),
    []
  );
  const themeSuccessStyle = useThemeStyles<TextStyle>(
    theme => ({
      borderColor: theme.palette["successBase"],
    }),
    []
  );
  const titleContainerStyle = useThemeStyles<TextStyle>(
    theme => ({
      marginBottom: theme.spacing.small,
    }),
    []
  );

  return (
    <View
      style={[
        container,
        borderPosition === "left" && styles.borderLeft,
        borderPosition === "right" && styles.borderRight,
        variant === "compliment" && themeComplimentStyle,
        variant === "error" && themeErrorStyle,
        variant === "primary" && themePrimaryStyle,
        variant === "success" && themeSuccessStyle,
      ]}>
      {title && (
        <View style={titleContainerStyle}>
          <Typography.Text size="footnote" weight="semiBold">
            {title}
          </Typography.Text>
        </View>
      )}
      {content && <Typography.Text size="caption1">{content}</Typography.Text>}
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
});
