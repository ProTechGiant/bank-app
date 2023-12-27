import { Pressable, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CustomPillProps {
  children?: React.ReactNode;
  isActive?: boolean;
  onPress: () => void;
  title: string;
}

export default function CustomPill({ children, isActive = false, onPress, title }: CustomPillProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: isActive ? theme.palette["neutralBase-60"] : undefined,
      borderColor: isActive ? theme.palette["neutralBase-60"] : theme.palette["neutralBase-30"],
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
    <Pressable onPress={onPress} style={containerStyles}>
      <Stack direction="horizontal" align="center" gap="12p">
        <Typography.Text color={isActive ? "neutralBase+30" : "neutralBase-10"} size="footnote" weight="medium">
          {title}
        </Typography.Text>
        {children}
      </Stack>
    </Pressable>
  );
}
