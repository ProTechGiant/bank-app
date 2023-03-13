import { Pressable, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import useThemeStyles from "@/theme/use-theme-styles";

interface CardButtonToggleProps {
  onPress: () => void;
  onInfoPress: () => void;
  text: string;
  icon: React.ReactNode;
  toggleValue: boolean;
}

export default function CardButtonToggle({ onPress, onInfoPress, text, icon, toggleValue }: CardButtonToggleProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.small,
  }));

  const infoCircleIconStyle = useThemeStyles(theme => ({
    width: theme.iconDimensions.info,
    height: theme.iconDimensions.info,
    color: theme.palette["neutralBase-10"],
  }));

  return (
    <Pressable>
      <Stack direction="horizontal" justify="space-between" style={containerStyle}>
        <Stack direction="horizontal" gap="24p">
          <Stack direction="horizontal">{icon}</Stack>
          <Stack direction="horizontal" gap="4p" justify="center" align="center">
            <Typography.Text size="callout" weight="medium">
              {text}
            </Typography.Text>
            <Pressable onPress={onInfoPress}>
              <InfoCircleIcon
                width={infoCircleIconStyle.width}
                height={infoCircleIconStyle.height}
                color={infoCircleIconStyle.color}
              />
            </Pressable>
          </Stack>
        </Stack>
        <Toggle value={toggleValue} onPress={onPress} />
      </Stack>
    </Pressable>
  );
}
