import { Platform, View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

interface HeaderContentProps {
  headerTitle: string;
  children: React.ReactNode;
}

export default function HeaderContent({ children, headerTitle }: HeaderContentProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: Platform.OS === "android" ? -theme.spacing["48p"] : -theme.spacing["20p"],
  }));

  return (
    <View style={containerStyle}>
      <NavHeader
        variant="angled"
        title={<Typography.Text color="neutralBase-60">{headerTitle} </Typography.Text>}
        backgroundAngledColor="#002233">
        <View>{children}</View>
      </NavHeader>
    </View>
  );
}
