import { truncate } from "lodash";
import { useEffect, useState } from "react";
import {
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

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import explorePlaceholder from "../assets/explore-placeholder.png";
import whiteTriangle from "../assets/white-triangle.png";
import Tag, { TagVariantType } from "./Tag";

interface ExploreCardProps {
  title: string;
  description: string;
  tagTitle: string;
  tagVariant: TagVariantType;
  onPress: () => void;
}

export default function ExploreCard({ title, description, tagTitle, tagVariant, onPress }: ExploreCardProps) {
  const { width } = useWindowDimensions();

  const [containerHeight, setContainerHeight] = useState(100);
  const [cutoutStyle, setCutoutStyle] = useState<ImageStyle>({ position: "absolute", right: 0 });

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-40"],
    flexDirection: "row",
    borderRadius: theme.radii.small,
    width: "100%",
  }));

  const imageContentStyle = useThemeStyles<ImageStyle>(theme => ({
    borderTopLeftRadius: theme.radii.small,
    borderBottomLeftRadius: theme.radii.small,
    flex: 1,
    width: Platform.OS === "android" ? width * 0.25 : width * 0.35,
  }));

  const textContentStyle = useThemeStyles<TextStyle>(theme => ({
    flex: 1,
    paddingTop: theme.spacing["24p"],
    paddingLeft: theme.spacing["12p"],
    paddingRight: theme.spacing["4p"],
    paddingBottom: theme.spacing["8p"],
  }));

  useEffect(() => {
    setCutoutStyle(prevState => ({
      ...prevState,
      height: containerHeight,
    }));
  }, [containerHeight]);

  return (
    <Pressable style={containerStyle} onPress={onPress}>
      <View>
        <Image
          source={explorePlaceholder}
          style={imageContentStyle}
          onLayout={event => {
            const { height } = event.nativeEvent.layout;
            setContainerHeight(height);
          }}
        />
        <Image source={whiteTriangle} style={cutoutStyle} resizeMode="stretch" />
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
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
});
