import { Image, ImageSourcePropType, ImageStyle, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface ArticleSectionContentProps {
  data: { id: number; image: ImageSourcePropType };
}
export default function ArticleSectionContent({ data }: ArticleSectionContentProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      borderRadius: theme.radii.small,
      marginHorizontal: theme.spacing.medium,
    }),
    []
  );
  const imageContainerStyle = useThemeStyles<ImageStyle>(
    theme => ({
      borderRadius: theme.radii.small,
      height: 440,
      width: "100%",
    }),
    []
  );

  return (
    <View style={container}>
      <Image source={data.image} style={imageContainerStyle} />
    </View>
  );
}
