import { Pressable, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import QuickAction from "./QuickAction";

interface QuickActionToggleProps {
  icon: React.ReactElement<SvgProps | IconProps>;
  title: string;
  type: string;
  description: string;
  isActive: boolean;
  onPress: (itemId: string) => void;
}

export default function QuickActionToggle({
  isActive,
  icon,
  title,
  type,
  description,
  onPress,
}: QuickActionToggleProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  }));

  const quickActionViewStyle = useThemeStyles<ViewStyle>(() => ({
    justifyContent: "center",
    alignItems: "center",
  }));

  const textContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexShrink: 1,
    paddingLeft: theme.spacing["12p"],
  }));
  return (
    <Pressable onPress={() => onPress(type)} key={type}>
      <Stack direction="horizontal" style={containerStyle}>
        <View style={quickActionViewStyle}>
          <QuickAction color="neutralBase+30" icon={icon} title="" onPress={() => onPress(type)} withTitle={false} />
        </View>
        <Stack style={textContainerStyle} direction="vertical">
          <Typography.Text size="callout">{title}</Typography.Text>
          <Typography.Text size="footnote" color="neutralBase">
            {description}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal">
          <Toggle value={isActive} onPress={() => onPress(type)} />
        </Stack>
      </Stack>
    </Pressable>
  );
}
