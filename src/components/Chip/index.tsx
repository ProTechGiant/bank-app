import { Pressable, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ChipProps {
  title: string;
  isClosable: boolean;
  isEnabled: boolean;
  onPress: () => void;
}

export default function Chip({ title, isClosable, isEnabled, onPress }: ChipProps) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: isEnabled ? theme.palette["neutralBase-40"] : undefined,
      borderRadius: theme.radii.xlarge,
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
      borderColor: isEnabled ? theme.palette.primaryBase : theme.palette["neutralBase-30"],
      borderWidth: 2,
      flexDirection: "row",
    }),
    [isEnabled]
  );

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingLeft: theme.spacing["8p"],
  }));

  return (
    <Pressable style={containerStyle} onPress={onPress}>
      <Typography.Text size="footnote">{title}</Typography.Text>
      {isClosable ? (
        <View style={iconContainerStyle}>
          <CloseIcon width={18} height={18} />
        </View>
      ) : null}
    </Pressable>
  );
}
