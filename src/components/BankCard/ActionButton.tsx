import { Pressable, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface ActionButtonProps {
  title: string;
  onPress: () => void;
}

export default function ActionButton({ title, onPress }: ActionButtonProps) {
  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: 20,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
    flexDirection: "row",
    justifyContent: "center",
  }));

  return (
    <Pressable onPress={onPress} style={containerStyles}>
      <Typography.Text color="neutralBase+30" size="callout" weight="medium">
        {title}
      </Typography.Text>
    </Pressable>
  );
}
