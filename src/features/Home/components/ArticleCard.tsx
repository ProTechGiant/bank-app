import { truncate } from "lodash";
import { useState } from "react";
import { ImageStyle, Pressable, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import { TagVariantType } from "@/components/Tag";
import Typography from "@/components/Typography";
import TopTenHeaderIcon from "@/features/WhatsNext/assets/TopTenHeaderIcon";
import { getWhatsNextTagColorBranded } from "@/features/WhatsNext/utils";
import { useThemeStyles } from "@/theme";

interface TopTenCardProps {
  category: string;
  title: string;
  description: string;
  tagVariant: TagVariantType;
  imageURL: string | undefined;
  onPress: () => void;
}

export default function ArticleCard({ category, title, tagVariant, description, imageURL, onPress }: TopTenCardProps) {
  const { width } = useWindowDimensions();

  const [containerWidth, setContainerWidth] = useState<number>(100);

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

  const headerIconStyle = useThemeStyles<ViewStyle>(() => ({
    position: "absolute",
    top: 0,
    zIndex: 1,
    left: 0,
  }));

  const containerStyle = useThemeStyles<ImageStyle>(theme => ({
    overflow: "hidden",
    borderRadius: theme.radii.medium,
  }));

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <View style={headerIconStyle}>
        <TopTenHeaderIcon width={containerWidth} color={tagVariant} />
      </View>

      <NetworkImage
        style={imageStyle}
        source={{ uri: imageURL || "" }}
        onLayout={event => {
          const { width: currentWidth } = event.nativeEvent.layout;
          setContainerWidth(currentWidth);
        }}
      />
      <LinearGradient
        style={{ ...StyleSheet.absoluteFillObject }}
        colors={["#00000000", "#000000"]}
        locations={[0.2, 0.9]}
      />
      <View style={textStyle}>
        <Stack direction="vertical" gap="4p">
          <Typography.Text
            color={imageURL ? getWhatsNextTagColorBranded(tagVariant) : "neutralBase+30"}
            size="caption2">
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
