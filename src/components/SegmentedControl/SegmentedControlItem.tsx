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
      borderBottomColor: isActive ? theme.palette.complimentBase : "transparent",
      borderBottomWidth: 2,
      paddingBottom: theme.spacing["12p"],
    }),
    [isActive]
  );

  const containerStyleNoUnderline = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
      alignContent: "center",
      justifyContent: "center",
      backgroundColor: isActive ? theme.palette["neutralBase+30"] : undefined,
      borderRadius: theme.radii.xxlarge,
      flexGrow: 1,
      paddingBottom: theme.spacing["12p"],
    }),
    [isActive]
  );

  return (
    <Pressable onPress={onPress} style={withUnderline ? containerStyle : containerStyleNoUnderline}>
      <Typography.Text color={isActive ? "neutralBase-60" : "neutralBase"} size="callout" weight={fontWeight}>
        {children}
      </Typography.Text>
      {hasUpdate ? <UnreadNotificationIcon /> : null}
    </Pressable>
  );
}
