import { Image } from "react-native";

import Page from "@/components/Page";

interface SourceProps {
  uri: string;
}

interface PreviewImageProps {
  source: SourceProps;
}

export default function PreviewPDF({ source }: PreviewImageProps) {
  return (
    <Page backgroundColor="neutralBase-60">
      <Image source={source} style={{ flex: 1 }} />
    </Page>
  );
}
