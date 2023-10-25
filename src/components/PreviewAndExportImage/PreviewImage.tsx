import { Image, ImageStyle } from "react-native";

import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

interface SourceProps {
  uri: string;
}

interface PreviewImageProps {
  source: SourceProps;
}

export default function PreviewPDF({ source }: PreviewImageProps) {
  const imageViewStyle = useThemeStyles<ImageStyle>(theme => ({
    flex: 1,
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <Image source={source} style={imageViewStyle} />
    </Page>
  );
}
