import { truncate } from "lodash";
import { ImageStyle, Pressable, useWindowDimensions, View, ViewStyle } from "react-native";

import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TopTenCardProps {
  category: string;
  title: string;
  description: string;
  imageURL: string | undefined;
  onPress: () => void;
}

export default function TopTenCard({ category, title, description, imageURL, onPress }: TopTenCardProps) {
  const { width } = useWindowDimensions();

  const imageStyle = useThemeStyles<ImageStyle>(theme => ({
    borderRadius: theme.radii.small,
    height: width - theme.spacing["64p"],
    width: width - theme.spacing["64p"],
  }));

  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: theme.spacing["20p"],
    marginHorizontal: theme.spacing["20p"],
  }));

  return (
    <Pressable onPress={onPress}>
      <NetworkImage style={imageStyle} source={{ uri: imageURL || "" }} />
      <View style={textStyle}>
        <Stack direction="vertical" gap="4p">
          <Typography.Text color={imageURL ? "neutralBase-60" : "neutralBase+30"} size="caption2">
            {category}
          </Typography.Text>
          <Typography.Text color={imageURL ? "neutralBase-60" : "neutralBase+30"} size="title3" weight="medium">
            {truncate(title, { length: 18 })}
          </Typography.Text>
          <Typography.Text color={imageURL ? "neutralBase-60" : "neutralBase+10"} size="footnote">
            {truncate(description, { length: 71 })}
          </Typography.Text>
        </Stack>
      </View>
    </Pressable>
  );
}
