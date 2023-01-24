import { Image, ImageSourcePropType, ImageStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface RewardSectionContentProps {
  data: { id: number; image: ImageSourcePropType };
}

export default function RewardSectionContent({ data }: RewardSectionContentProps) {
  const imageStyle = useThemeStyles<ImageStyle>(
    theme => ({
      width: 330,
      height: 180,
      borderRadius: theme.radii.small,
    }),
    []
  );
  return <Image source={data.image} style={imageStyle} />;
}
