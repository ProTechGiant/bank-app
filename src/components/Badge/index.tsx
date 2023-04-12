import { View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import Typography from "../Typography";

interface BadgeProps {
  label: string;
}

export default function Badge({ label }: BadgeProps) {
  const container = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["primaryBase-40"],
    borderRadius: theme.radii.extraSmall,
    height: 26,
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
    gap: 10,
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <View style={container}>
      <Typography.Text color="neutralBase-60" size="footnote" weight="medium">
        {label}
      </Typography.Text>
    </View>
  );
}
