import { Pressable, View, ViewStyle } from "react-native";

import { CheckboxInput } from "@/components/Input";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import QuickAction from "./QuickAction";

interface QuickActionToggleProps {
  title: string;
  iconName?: string;
  description: string;
  isActive: boolean;
  onPress: () => void;
  numberOfActiveItems: number;
  testID?: string;
}

export default function QuickActionToggle({
  isActive,
  title,
  description,
  onPress,
  iconName,
  numberOfActiveItems,
  testID,
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

  const iconAndTitleColor =
    numberOfActiveItems === REQUIRED_ACTIVE_ITEMS && !isActive ? "neutralBase-30" : "neutralBase+20";
  const descriptionColor =
    numberOfActiveItems === REQUIRED_ACTIVE_ITEMS && !isActive ? "neutralBase-30" : "neutralBase";

  return (
    <Pressable testID={testID !== undefined ? `${testID}-Pressed}` : undefined} onPress={onPress}>
      <Stack direction="horizontal" style={containerStyle}>
        <View style={quickActionViewStyle}>
          <QuickAction color={iconAndTitleColor} iconName={iconName} backgroundColor="neutralBase-40" />
        </View>
        <Stack style={textContainerStyle} direction="vertical">
          <Typography.Text color={iconAndTitleColor} size="callout">
            {title}
          </Typography.Text>
          <Typography.Text size="footnote" color={descriptionColor}>
            {description}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal">
          <CheckboxInput
            testID={testID !== undefined ? `${testID}-${title}-checkbox}` : undefined}
            value={isActive}
            onChange={onPress}
            isEditable={numberOfActiveItems < REQUIRED_ACTIVE_ITEMS || isActive}
          />
        </Stack>
      </Stack>
    </Pressable>
  );
}

const REQUIRED_ACTIVE_ITEMS = 4;
