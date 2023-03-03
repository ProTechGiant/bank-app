import { Pressable, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface ActionButtonProps {
  title: string;
  type: "dark" | "light";
  onPress?: () => void;
}

export default function ActionButton({ title, type, onPress }: ActionButtonProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: type === "light" ? theme.palette["neutralBase-50"] : "#00000014",
      borderRadius: 20,
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
      flexDirection: "row",
      justifyContent: "center",
    }),
    [type]
  );

  return (
    <Pressable onPress={onPress} style={containerStyles}>
      <Typography.Text color={type === "light" ? "neutralBase+30" : "neutralBase-50"} size="callout" weight="medium">
        {title}
      </Typography.Text>
    </Pressable>
  );
}
