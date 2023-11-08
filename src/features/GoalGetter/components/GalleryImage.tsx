import { ImageStyle, Pressable, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import NetworkImage from "@/components/NetworkImage";
import { useThemeStyles } from "@/theme";

import { GallerySelectIcon } from "../assets/icons";

interface GalleryImageProps {
  id: string;
  imageURL: string;
  isSelected: boolean;
  onImageSelection: (id: string) => void;
}

export default function GalleryImage({ id, imageURL, isSelected, onImageSelection }: GalleryImageProps) {
  const { width, height } = useWindowDimensions();

  const contentStyle = useThemeStyles<ImageStyle>(() => ({
    height: height / 6,
    width: width / 3,
  }));

  const checkIconStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 14,
    width: 14,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radii.small,
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-60"],
    backgroundColor: theme.palette["neutralBase-60"],
    position: "absolute",
    top: theme.spacing["8p"],
    right: "50%",
  }));

  return (
    <Pressable style={contentStyle} onPress={() => onImageSelection(id)}>
      <NetworkImage style={styles.imageStyle} source={{ uri: imageURL }} />
      {isSelected ? (
        <View style={checkIconStyle}>
          <GallerySelectIcon />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    flex: 1,
  },
});
