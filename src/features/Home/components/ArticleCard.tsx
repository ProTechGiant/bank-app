import { truncate } from "lodash";
import { ImageStyle, Pressable, Text, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native";

import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

interface TopTenCardProps {
  category: string;
  title: string;
  description: string;
  imageURL: string | undefined;
  onPress: () => void;
}

export default function ArticleCard({ category, title, description, imageURL, onPress }: TopTenCardProps) {
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

  const textCategoryColorStyle = useThemeStyles<TextStyle>(theme => ({
    color: imageURL !== undefined ? "#ffffff" : "neutralBase+30",
    fontSize: theme.typography.text.sizes.caption2,
    fontWeight: theme.typography.text.weights.regular,
  }));

  const textTitleColorStyle = useThemeStyles<TextStyle>(theme => ({
    color: imageURL !== undefined ? "#ffffff" : "neutralBase+30",
    fontSize: theme.typography.text.sizes.title3,
    fontWeight: theme.typography.text.weights.medium,
  }));
  const textDescriptionColorStyle = useThemeStyles<TextStyle>(theme => ({
    color: imageURL !== undefined ? "#ffffff" : "neutralBase+10",
    fontSize: theme.typography.text.sizes.footnote,
    fontWeight: theme.typography.text.weights.regular,
  }));

  return (
    <Pressable onPress={onPress}>
      <NetworkImage style={imageStyle} source={{ uri: imageURL || "" }} />
      <View style={textStyle}>
        <Stack direction="vertical" gap="4p">
          <Text style={textCategoryColorStyle}>{category}</Text>
          <Text style={textTitleColorStyle}>{truncate(title, { length: 18 })}</Text>
          <Text style={textDescriptionColorStyle}>{truncate(description, { length: 71 })}</Text>
        </Stack>
      </View>
    </Pressable>
  );
}
