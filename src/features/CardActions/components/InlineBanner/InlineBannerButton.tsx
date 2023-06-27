import { View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

export interface InlineBannerButtonProps {
  onPress: () => void;
  text: string;
}

export default function InlineBannerButton({ onPress, text }: InlineBannerButtonProps) {
  const buttonContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    marginTop: theme.spacing["8p"],
  }));

  return (
    <View style={buttonContainerStyles}>
      <Button onPress={onPress} variant="tertiary" size="mini">
        {text}
      </Button>
    </View>
  );
}
