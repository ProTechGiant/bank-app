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
      backgroundColor: isActive ? theme.palette.complimentBase : undefined,
      borderColor: isActive ? theme.palette.complimentBase : theme.palette["neutralBase-30"],
      borderRadius: theme.radii.xxlarge,
      borderWidth: 1,
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
      alignItems: "center",
      marginHorizontal: theme.spacing["4p"],
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
