import { View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ListItemProps {
  icon: React.ReactElement<SvgProps | IconProps>;
  title: string;
  value: string;
}

export default function ListItem({ title, value, icon }: ListItemProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    padding: theme.spacing["16p"],
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    height: 35,
    width: 35,
    borderRadius: theme.radii.extraSmall,
    justifyContent: "center",
    alignItems: "center",
  }));

  return (
    <Stack direction="horizontal" gap="12p" style={containerStyle}>
      <View style={iconContainerStyle}>{icon}</View>
      <Stack direction="vertical" gap="4p">
        <Typography.Text color="neutralBase" size="footnote">
          {title}
        </Typography.Text>
        <Typography.Text size="callout">{value}</Typography.Text>
      </Stack>
    </Stack>
  );
}
