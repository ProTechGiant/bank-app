import { TextStyle, View, ViewStyle } from "react-native";

import { WithShadow } from "@/components";
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
      borderColor:
        variant === "compliment"
          ? theme.palette.complimentBase
          : variant === "success"
          ? theme.palette.successBase
          : variant === "error"
          ? theme.palette.errorBase
          : theme.palette["primaryBase-40"],
      borderStartWidth: borderPosition === "start" ? 4 : undefined,
      borderEndWidth: borderPosition === "end" ? 4 : undefined,
      borderRadius: theme.radii.extraSmall,
      padding: theme.spacing["16p"],
    }),
    [borderPosition, variant]
  );

  const titleContainerStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <WithShadow backgroundColor="neutralBase-50" borderRadius="extraSmall" elevation={6}>
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
    </WithShadow>
  );
}
