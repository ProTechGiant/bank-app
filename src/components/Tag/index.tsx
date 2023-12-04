import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export type TagVariantType = "purple" | "mint" | "blue" | "yellow" | "pink" | "secondary-mint" | "secondary-yellow";

interface TagProps {
  title: string;
  variant: TagVariantType;
}
export default function Tag({ title, variant }: TagProps) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing["8p"],
      paddingVertical: theme.spacing["4p"],
      borderRadius: theme.radii.extraSmall,
      backgroundColor:
        variant === "purple"
          ? theme.palette["secondary_purpleBase-10"]
          : variant === "mint"
          ? theme.palette.secondary_mintBase
          : variant === "blue"
          ? theme.palette["secondary_blueBase-20"]
          : variant === "yellow"
          ? theme.palette["secondary_yellowBase-30"]
          : variant === "pink"
          ? theme.palette["secondary_pinkBase-30"]
          : variant === "secondary-mint"
          ? theme.palette["secondary_mintBase-20"]
          : variant === "secondary-yellow"
          ? theme.palette["secondary_yellowBase-30"]
          : undefined,
    }),
    [variant]
  );

  return (
    <View style={containerStyle}>
      <Typography.Text
        weight="bold"
        size="caption2"
        color={
          variant === "mint" ||
          variant === "yellow" ||
          variant === "pink" ||
          variant === "secondary-mint" ||
          variant === "secondary-yellow"
            ? "neutralBase+30"
            : "neutralBase-60"
        }>
        {title}
      </Typography.Text>
    </View>
  );
}
