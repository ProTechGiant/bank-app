import { GestureResponderEvent, TouchableOpacity, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SectionHeaderProps {
  title: string;
  subTitle?: { text: string; onPress?: (event: GestureResponderEvent) => void };
}

export default function SectionHeader({ title, subTitle }: SectionHeaderProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.medium,
      paddingTop: theme.spacing.medium,
      width: "100%",
    }),
    []
  );

  return (
    <View style={container}>
      <Typography.Text size="footnote" weight="medium" color="primaryBase-20">
        {title.toUpperCase()}
      </Typography.Text>
      {subTitle?.onPress && (
        <TouchableOpacity onPress={subTitle.onPress}>
          <Typography.Text size="footnote" weight="medium" color="primaryBase-20">
            {subTitle.text}
          </Typography.Text>
        </TouchableOpacity>
      )}
      {!subTitle?.onPress && subTitle?.text && (
        <Typography.Text size="footnote" weight="medium" color="primaryBase-20">
          {subTitle.text}
        </Typography.Text>
      )}
    </View>
  );
}
