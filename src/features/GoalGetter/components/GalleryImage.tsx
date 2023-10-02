import { ImageStyle, Pressable, useWindowDimensions, View, ViewStyle } from "react-native";

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
  const { width } = useWindowDimensions();

  const contentStyle = useThemeStyles<ImageStyle>(theme => ({
    borderRadius: theme.radii.small,
    height: width / 3,
    width: "48%",
    marginHorizontal: theme.spacing["4p"],
    marginVertical: theme.spacing["4p"],
  }));

  const imageStyle = useThemeStyles<ImageStyle>(theme => ({
    borderRadius: theme.radii.small,
    flex: 1,
  }));

  const imageSelectedStyle = useThemeStyles<ImageStyle>(theme => ({
    borderColor: theme.palette["complimentBase+10"],
    borderWidth: 3,
  }));

  const checkIconStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    top: theme.spacing["8p"],
    right: theme.spacing["8p"],
  }));

  return (
    <Pressable style={contentStyle} onPress={() => onImageSelection(id)}>
      <NetworkImage style={[imageStyle, isSelected && imageSelectedStyle]} source={{ uri: imageURL }} />
      {isSelected ? (
        <View style={checkIconStyle}>
          <GallerySelectIcon />
        </View>
      ) : null}
    </Pressable>
  );
}
