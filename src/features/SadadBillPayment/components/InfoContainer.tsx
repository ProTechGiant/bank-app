import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InfoContainerProps {
  title: string;
  body: string;
  hasTopRadius?: boolean;
  hasBottomRadius?: boolean;
}
export default function InfoContainer({ title, body, hasTopRadius, hasBottomRadius }: InfoContainerProps) {
  const container = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    backgroundColor: theme.palette["primaryBase-70-8%"],
    padding: theme.spacing["16p"],
    borderTopRightRadius: hasTopRadius ? theme.spacing["4p"] : 0,
    borderTopLeftRadius: hasTopRadius ? theme.spacing["4p"] : 0,
    borderBottomRightRadius: hasBottomRadius ? theme.spacing["4p"] : 0,
    borderBottomLeftRadius: hasBottomRadius ? theme.spacing["4p"] : 0,
  }));

  return (
    <View style={container}>
      <Typography.Text color="neutralBase-20" size="callout">
        {title}
      </Typography.Text>
      <Typography.Text color="neutralBase-60" size="title2">
        {body}
      </Typography.Text>
    </View>
  );
}
