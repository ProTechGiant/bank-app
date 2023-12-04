import truncate from "lodash/truncate";
import { useState } from "react";
import {
  I18nManager,
  Image,
  ImageStyle,
  Platform,
  Pressable,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import Tag, { TagVariantType } from "@/components/Tag";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import CoverSideImage from "../assets/CoverSideImage.png";

interface ExploreCardProps {
  title: string;
  description: string;
  tagTitle: string;
  tagVariant: TagVariantType;
  imageURL: string;
  onPress: () => void;
}

export default function ExploreCard({ title, description, imageURL, tagTitle, tagVariant, onPress }: ExploreCardProps) {
  const { width } = useWindowDimensions();
  const [containerHeight, setContainerHeight] = useState(100);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    borderRadius: theme.radii.small,
    width: "100%",
  }));

  const imageContentStyle = useThemeStyles<ImageStyle>(theme => ({
    borderTopLeftRadius: theme.radii.medium,
    borderBottomLeftRadius: theme.radii.medium,
    flex: 1,
    width: Platform.OS === "android" ? width * 0.3 : width * 0.35,
    height: 177,
  }));

  const textContentStyle = useThemeStyles<TextStyle>(theme => ({
    flex: 1,
    paddingTop: theme.spacing["24p"],
    paddingLeft: theme.spacing["12p"],
    paddingRight: theme.spacing["4p"],
    paddingBottom: theme.spacing["8p"],
  }));

  return (
    <Pressable style={containerStyle} onPress={onPress}>
      <View>
        <NetworkImage
          style={imageContentStyle}
          source={{ uri: imageURL }}
          onLayout={event => {
            const { height } = event.nativeEvent.layout;
            setContainerHeight(height);
          }}
        />
        <Image source={CoverSideImage} style={[styles.cutoutStyle, { height: containerHeight }]} resizeMode="stretch" />
      </View>
      <View style={textContentStyle}>
        <Stack direction="vertical" gap="8p">
          <Tag title={tagTitle} variant={tagVariant} />
          <View style={styles.row}>
            <Typography.Text size="callout" weight="medium">
              {truncate(title, { length: 39 })}
            </Typography.Text>
          </View>
          <View style={styles.row}>
            <Typography.Text size="footnote" color="neutralBase+10">
              {truncate(description, { length: 79 })}
            </Typography.Text>
          </View>
        </Stack>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cutoutStyle: {
    position: "absolute",
    right: -1,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    width: 37,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
});
