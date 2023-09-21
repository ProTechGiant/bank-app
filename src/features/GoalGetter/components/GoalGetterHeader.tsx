import { useState } from "react";
import { I18nManager, Image, Pressable, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import whiteTriangleHorizontal from "@/assets/rectangle-image-divider.png";
import NetworkImage from "@/components/NetworkImage";
import { useThemeStyles } from "@/theme";

import { ChangeImageIcon } from "../assets/icons";

interface GoalGetterSectionProps {
  handleChangeImage: () => void;
  imageURL: string;
}

export default function GoalGetterSection({ handleChangeImage, imageURL }: GoalGetterSectionProps) {
  const { height } = useWindowDimensions();

  const [containerWidth, setContainerWidth] = useState(100);

  const handleImageStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    right: theme.spacing["8p"],
    bottom: I18nManager.isRTL ? theme.spacing["20p"] : theme.spacing["20p"],
  }));

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
      <Pressable onPress={handleChangeImage} style={handleImageStyle}>
        <ChangeImageIcon />
      </Pressable>
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
