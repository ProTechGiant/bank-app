import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";

interface InfoBoxProps {
  description: string;
  color: keyof Theme["palette"];
}

export default function InfoBox({ description, color }: InfoBoxProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      borderLeftWidth: theme.spacing["4p"],
      borderLeftColor: theme.palette[color],
      padding: theme.spacing["16p"],
      borderTopRightRadius: theme.radii.small,
      borderBottomRightRadius: theme.radii.small,
      backgroundColor: theme.palette["supportBase-20"],
    }),
    [color]
  );

  return (
    <View style={container}>
      <Typography.Text size="caption2" weight="regular" color="neutralBase+20">
        {description}
      </Typography.Text>
    </View>
  );
}
