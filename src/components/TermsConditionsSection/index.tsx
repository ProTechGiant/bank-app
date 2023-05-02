import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TitleContentSectionProps {
  title: string;
  content: string;
}

export default function TermsConditionsSection({ title, content }: TitleContentSectionProps) {
  const sectionTitleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <>
      <View style={sectionTitleContainerStyle}>
        <Typography.Text color="neutralBase+30" size="title3" weight="medium">
          {title}
        </Typography.Text>
      </View>
      <View>
        <Typography.Text color="neutralBase" size="callout" weight="regular">
          {content}
        </Typography.Text>
      </View>
    </>
  );
}
