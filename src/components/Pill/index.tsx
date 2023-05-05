import { Pressable, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface PillProps {
  children: string;
  isActive?: boolean;
  onPress: () => void;
  testID?: string;
}

export default function Pill({ children, isActive = false, onPress, testID }: PillProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: isActive ? theme.palette["neutralBase+30"] : undefined,
      borderColor: isActive ? theme.palette["neutralBase+30"] : theme.palette["neutralBase-30"],
      borderRadius: theme.radii.xxlarge,
      borderWidth: 1,
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
      alignItems: "center",
    }),
    [isActive]
  );

  return (
    <Pressable onPress={onPress} style={containerStyles} testID={testID}>
      <Typography.Text color={isActive ? "neutralBase-60" : "neutralBase-10"} size="footnote" weight="medium">
        {children}
      </Typography.Text>
    </Pressable>
  );
}
