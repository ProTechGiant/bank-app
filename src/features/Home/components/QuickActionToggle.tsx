import { Pressable, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import QuickAction from "./QuickAction";

interface QuickActionToggleProps {
  icon?: React.ReactElement<SvgProps | IconProps>;
  image?: string;
  title: string;
  description: string;
  isActive: boolean;
  onPress: () => void;
}

export default function QuickActionToggle({
  isActive,
  icon,
  image,
  title,
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
    flex: 1,
    paddingLeft: theme.spacing["12p"],
    alignItems: "flex-start",
  }));
  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" style={containerStyle}>
        <View style={quickActionViewStyle}>
          <QuickAction
            backgroundColor="neutralBase-40"
            color="neutralBase+30"
            icon={icon}
            image={image}
            onPress={onPress}
          />
        </View>
        <Stack style={textContainerStyle} direction="vertical">
          <Typography.Text size="callout">{title}</Typography.Text>
          <Typography.Text size="footnote" color="neutralBase">
            {description}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal">
          <Toggle value={isActive} onPress={onPress} />
        </Stack>
      </Stack>
    </Pressable>
  );
}
