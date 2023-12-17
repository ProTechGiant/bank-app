import { ViewStyle } from "react-native";
import Pdf from "react-native-pdf";

import Page from "@/components/Page";
import useOpenLink from "@/hooks/use-open-link";
import { useThemeStyles } from "@/theme";

interface SourceProps {
  uri: string;
}

interface PreviewPDFProps {
  fullPreviewMode: boolean;
  source: SourceProps;
}

export default function PreviewPDF({ fullPreviewMode = false, source }: PreviewPDFProps) {
  const openLink = useOpenLink();

  const pdfViewStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.transparent,
    flex: 1,
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <Pdf
        showsVerticalScrollIndicator={false}
        singlePage={!fullPreviewMode}
        source={source}
        style={pdfViewStyle}
        onPressLink={url => {
          try {
            openLink(url);
          } catch (err) {}
        }}
      />
    </Page>
  );
}
