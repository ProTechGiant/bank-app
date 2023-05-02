import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TitleContentSectionProps {
  title: string;
  content: string;
}

export default function TitleContentSection({ title, content }: TitleContentSectionProps) {
  const sectionTitleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <>
      <View style={sectionTitleContainerStyle}>
        <Typography.Text size="title3" weight="semiBold">
          {title}
        </Typography.Text>
      </View>
      <View>
        <Typography.Text size="callout" color="neutralBase">
          {content}
        </Typography.Text>
      </View>
    </>
  );
}
