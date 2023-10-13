import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ListItemTextProps {
  title: string;
  value: string;
  testID?: string;
}

export default function ListItemText({ title, value, testID }: ListItemTextProps) {
  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing["16p"],
    height: 73,
    gap: 10,
  }));

  return (
    <View style={containerStyles} testID={testID}>
      <Typography.Text size="callout" weight="medium">
        {title}
      </Typography.Text>
      <Typography.Text size="callout" color="neutralBase">
        {value}
      </Typography.Text>
    </View>
  );
}
