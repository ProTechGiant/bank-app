import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TagsProps {
  riskName: string;
}

export default function Tags({ riskName }: TagsProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["secondary_yellowBase-10"],
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
    borderWidth: 1,
    borderRadius: theme.radii.xxlarge,
    borderColor: theme.palette["neutralBase-30"],
    alignSelf: "flex-start",
    marginTop: theme.spacing["4p"],
    marginBottom: 15,
  }));

  return (
    <View style={containerStyle}>
      <Typography.Text color="neutralBase+30" size="caption1" weight="bold">
        {riskName}
      </Typography.Text>
    </View>
  );
}
