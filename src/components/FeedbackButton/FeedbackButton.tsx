import { cloneElement } from "react";
import { Pressable, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface FeedbackButtonProps {
  onPress: () => void;
  icon: React.ReactElement<SvgProps>;
  text: string;
}

export default function FeedbackButton({ onPress, icon, text }: FeedbackButtonProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing["4p"],
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: 59,
  }));

  const iconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      {cloneElement(icon, { color: iconColor })}
      <Typography.Text size="footnote" color="neutralBase+30">
        {text}
      </Typography.Text>
    </Pressable>
  );
}
