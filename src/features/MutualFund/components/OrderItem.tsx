import { View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Tag from "@/components/Tag";
import { useThemeStyles } from "@/theme";

interface OrderItemProps {
  name: string;
  status: string;
}
export default function OrderItem({ name, status }: OrderItemProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["16p"],
    borderWidth: 1,
    borderRadius: theme.spacing["8p"],
    width: "100%",
    borderColor: theme.palette["neutralBase-30"],
  }));

  return (
    <View style={containerStyle}>
      <Stack direction="horizontal" justify="space-between">
        <Tag title="High risk" variant="pink" />
        <View>
          <Typography.Text weight="medium" size="caption1">
            {status}
          </Typography.Text>
        </View>
      </Stack>
      <Typography.Text size="callout" weight="medium">
        {name}
      </Typography.Text>
    </View>
  );
}
