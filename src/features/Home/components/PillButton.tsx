import { Pressable, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import * as themevalues from "@/theme/values";

interface PillButtonProps {
  children?: string | React.ReactNode;
  onPress: () => void;
  backgroundColor?: keyof typeof themevalues.palette;
}

export default function PillButton({ children, onPress, backgroundColor = "complimentBase" }: PillButtonProps) {
  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette[backgroundColor],
    borderRadius: theme.radii.xxlarge,
    paddingHorizontal: theme.spacing["32p"],
    paddingVertical: theme.spacing["8p"],
  }));

  return (
    <Pressable onPress={onPress} style={containerStyles}>
      <Typography.Text color="neutralBase-50" size="footnote" weight="medium">
        {children}
      </Typography.Text>
    </Pressable>
  );
}
