import { Pressable, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface SegmentedControlItemProps<T> {
  children: string;
  isActive?: boolean;
  onPress?: () => void;
  value: T;
}

export default function SegmentedControlItem<T>({ children, isActive, onPress }: SegmentedControlItemProps<T>) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderBottomColor: isActive ? theme.palette["neutralBase+30"] : "transparent",
      borderBottomWidth: 2,
      paddingBottom: theme.spacing["12p"],
    }),
    [isActive]
  );

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <Typography.Text color={isActive ? "neutralBase+30" : "neutralBase-20"} size="callout" weight="medium">
        {children}
      </Typography.Text>
    </Pressable>
  );
}
