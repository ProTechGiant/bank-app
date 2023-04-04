import { Pressable, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface PillProps {
  text: string;
  isActive?: boolean;
  onPress: () => void;
  testID?: string;
}

export default function Pill({ text, isActive = false, onPress, testID }: PillProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: isActive ? theme.palette.primaryBase : theme.palette["neutralBase-40"],
      borderRadius: theme.radii.xxlarge,
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
      alignItems: "center",
    }),
    [isActive]
  );

  return (
    <Pressable onPress={onPress} style={containerStyles} testID={testID}>
      <Typography.Text color={isActive ? "neutralBase-50" : "primaryBase"} size="footnote" weight="medium">
        {text}
      </Typography.Text>
    </Pressable>
  );
}
