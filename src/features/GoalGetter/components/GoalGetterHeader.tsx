import { useState } from "react";
import { I18nManager, Image, StyleSheet, useWindowDimensions, View } from "react-native";

import whiteTriangleHorizontal from "@/assets/rectangle-image-divider.png";
import NetworkImage from "@/components/NetworkImage";

interface GoalGetterSectionProps {
  imageURL: string;
}

export default function GoalGetterSection({ imageURL }: GoalGetterSectionProps) {
  const { height } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(100);

  const containerStyle = {
    height: height * 0.37,
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
      <Image
        source={whiteTriangleHorizontal}
        style={[styles.imageBackGround, { width: containerWidth }]}
        resizeMode="stretch"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: "100%",
    width: "100%",
  },
  imageBackGround: {
    bottom: 0,
    position: "absolute",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
