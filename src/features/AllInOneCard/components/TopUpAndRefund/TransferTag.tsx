import { Pressable, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TagProps {
  title: string;
  active?: boolean;
  onPress: () => void;
}
export default function TransferTag({ title, active, onPress }: TagProps) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.padding.medium,
      paddingVertical: theme.padding.small,
      borderRadius: theme.radii.xxlarge,
      backgroundColor: active ? theme.palette.complimentBase : theme.palette["neutralBase-60"],
      borderWidth: 1,
      borderColor: active ? "transparent" : theme.palette["neutralBase-30"],
    }),
    [active]
  );

  return (
    <Pressable onPress={onPress}>
      <View style={containerStyle}>
        <Typography.Text size="footnote" weight="medium" color={active ? "neutralBase-60" : "neutralBase-10"}>
          {title}
        </Typography.Text>
      </View>
    </Pressable>
  );
}
