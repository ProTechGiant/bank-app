import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface BrandBannerProps {
  title: string;
}

export default function BrandBanner({ title }: BrandBannerProps) {
  const bannerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50-12%"],
      paddingVertical: theme.spacing["12p"],
      paddingHorizontal: theme.spacing["20p"],
      borderRadius: theme.radii.xlarge,
      marginBottom: "20%",
    }),
    []
  );

  return (
    <View style={bannerStyle}>
      <Typography.Text color="neutralBase-50">{title}</Typography.Text>
    </View>
  );
}
