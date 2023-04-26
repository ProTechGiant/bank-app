import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export type TagVariantType = "purple" | "mint" | "blue" | "yellow";

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
          ? theme.palette.secondary_blueBase
          : variant === "yellow"
          ? theme.palette["secondary_yellowBase-10"]
          : undefined,
    }),
    [variant]
  );

  return (
    <View style={containerStyle}>
      <Typography.Text
        size="caption2"
        color={variant === "mint" || variant === "yellow" ? "neutralBase+30" : "neutralBase-60"}>
        {title}
      </Typography.Text>
    </View>
  );
}
