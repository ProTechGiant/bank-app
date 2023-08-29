import { useState } from "react";
import { Image, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NavHeader from "@/components/NavHeader";
import NetworkImage from "@/components/NetworkImage";
import { useThemeStyles } from "@/theme";

import { LikeIcon } from "../assets";
import whiteTriangleHorizontal from "../assets/rectangle-image-divider.png";

interface ExploreAppreciationHeaderProps {
  onAppreciationFavoritePress: () => void;
  imageURL: string;
  isLiked: boolean;
}

export default function ExploreAppreciationHeader({
  onAppreciationFavoritePress,
  imageURL,
  isLiked,
}: ExploreAppreciationHeaderProps) {
  const { height } = useWindowDimensions();

  const [containerWidth, setContainerWidth] = useState(100);

  const navHeaderWrapper = useThemeStyles<ViewStyle>(theme => ({
    marginTop: -theme.spacing["16p"],
    position: "absolute",
    width: "100%",
  }));

  const likedColor = useThemeStyles(theme => theme.palette.complimentBase);
  const unLikedColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  const containerStyle = {
    height: height * 0.6,
  };

  return (
    <View style={containerStyle}>
      <NetworkImage
        source={{ uri: imageURL }}
        onLayout={event => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
        style={styles.image}
      />
      <SafeAreaView style={navHeaderWrapper}>
        <NavHeader
          variant="background"
          end={
            <NavHeader.IconEndButton
              icon={<LikeIcon color={isLiked ? likedColor : unLikedColor} />}
              onPress={onAppreciationFavoritePress}
            />
          }
        />
      </SafeAreaView>
      <Image
        source={whiteTriangleHorizontal}
        style={[styles.cutoutStyle, { width: containerWidth }]}
        resizeMode="stretch"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cutoutStyle: {
    bottom: 0,
    position: "absolute",
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
