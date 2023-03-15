import { TextStyle, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InfoBoxProps {
  borderPosition?: "start" | "end";
  children?: React.ReactNode;
  title?: string;
  variant: "compliment" | "success" | "error" | "primary";
}

export default function InfoBox({ borderPosition = "start", title, children, variant }: InfoBoxProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      borderColor:
        variant === "compliment"
          ? theme.palette.complimentBase
          : variant === "success"
          ? theme.palette.successBase
          : variant === "error"
          ? theme.palette.errorBase
          : theme.palette["primaryBase-40"],
      borderRadius: theme.radii.extraSmall,
      borderStartWidth: borderPosition === "start" ? 4 : undefined,
      borderEndWidth: borderPosition === "end" ? 4 : undefined,
      padding: theme.spacing["16p"],
      shadowColor: theme.palette["primaryBase-10"],
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: theme.radii.small,
      elevation: 3,
    }),
    [borderPosition, variant]
  );

  const titleContainerStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <View style={container}>
      {title && (
        <View style={titleContainerStyle}>
          <Typography.Text size="footnote" weight="semiBold">
            {title}
          </Typography.Text>
        </View>
      )}
      <Typography.Text size="caption1">{children}</Typography.Text>
    </View>
  );
}
