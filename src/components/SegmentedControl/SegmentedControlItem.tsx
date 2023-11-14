import { Pressable, ViewStyle } from "react-native";

import { UnreadNotificationIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface SegmentedControlItemProps<T> {
  children: string;
  isActive?: boolean;
  onPress?: () => void;
  value: T;
  hasUpdate?: boolean;
  fontWeight?: "medium" | "bold" | "regular" | "semiBold";
  withUnderline?: boolean;
}

export default function SegmentedControlItem<T>({
  children,
  isActive,
  hasUpdate,
  onPress,
  fontWeight = "medium",
  withUnderline = true,
}: SegmentedControlItemProps<T>) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      borderBottomColor: isActive ? theme.palette["neutralBase+30"] : "transparent",
      borderBottomWidth: 2,
      paddingBottom: theme.spacing["12p"],
    }),
    [isActive]
  );

  const containerStyleNoUnderline = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      margin: theme.spacing["4p"],
      padding: theme.spacing["8p"],
      alignContent: "center",
      justifyContent: "center",
      backgroundColor: isActive ? "white" : undefined,
      borderRadius: theme.radii.xxlarge,
      flex: 1,
      paddingBottom: theme.spacing["12p"],
    }),
    [isActive]
  );

  return (
    <Pressable onPress={onPress} style={withUnderline ? containerStyle : containerStyleNoUnderline}>
      <Typography.Text color={isActive ? "neutralBase+30" : "neutralBase-20"} size="callout" weight={fontWeight}>
        {children}
      </Typography.Text>
      {hasUpdate ? <UnreadNotificationIcon /> : null}
    </Pressable>
  );
}
