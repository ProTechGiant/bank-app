import { useState } from "react";
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

import explorePlaceholder from "../assets/explore-placeholder.png";
import { default as ShareArticleIcon } from "../assets/share-article";
import whiteTriangleHorizontal from "../assets/white-triangle-horizontal.png";

interface ExploreArticleHeaderProps {
  handleOnArticleSharePress: () => void;
}

export default function ExploreArticleHeader({ handleOnArticleSharePress }: ExploreArticleHeaderProps) {
  const { height } = useWindowDimensions();

  const [containerWidth, setContainerWidth] = useState(100);

  const containerStyle = {
    height: height * 0.6,
  };

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  return (
    <View style={containerStyle}>
      <Image
        source={explorePlaceholder}
        style={styles.image}
        onLayout={event => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
      />
      <SafeAreaView style={styles.navHeaderWrapper}>
        <NavHeader
          color="white"
          end={
            <Pressable onPress={handleOnArticleSharePress}>
              <ShareArticleIcon color={iconColor} />
            </Pressable>
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
  navHeaderWrapper: {
    position: "absolute",
    width: "100%",
  },
});
