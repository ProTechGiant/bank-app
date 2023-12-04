import { useState } from "react";
import { Image, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import brandedImageDivider from "@/assets/branded-image-divider.png";
import { LikeSmallIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import NetworkImage from "@/components/NetworkImage";
import { useThemeStyles } from "@/theme";

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

  const likeIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60-60%"],
    width: theme.spacing["32p"],
    height: theme.spacing["32p"],
    borderRadius: theme.spacing["64p"],
    alignItems: "center",
    justifyContent: "center",
  }));

  const likedColor = useThemeStyles(theme => theme.palette.complimentBase);
  const unLikedColor = useThemeStyles(theme => theme.palette["neutralBase-60-60%"]);

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
      <SafeAreaView style={styles.navHeaderWrapper}>
        <NavHeader
          variant="background"
          end={
            <NavHeader.IconEndButton
              icon={
                <View style={likeIconContainerStyle}>
                  <LikeSmallIcon color={isLiked ? likedColor : unLikedColor} />
                </View>
              }
              onPress={() => onAppreciationFavoritePress()}
            />
          }
        />
      </SafeAreaView>
      <Image
        source={brandedImageDivider}
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
  navHeaderWrapper: {
    position: "absolute",
    width: "100%",
  },
});
