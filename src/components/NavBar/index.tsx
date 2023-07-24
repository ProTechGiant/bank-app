import { SafeAreaView, View, ViewStyle } from "react-native";

import BackgroundBottom from "@/assets/BackgroundBottom";
import NavHeader from "@/components//NavHeader";
import { useThemeStyles } from "@/theme";

interface NavBarProps {
  title: string;
}

export default function NavBar({ title }: NavBarProps) {
  const backgroundAngledColor = useThemeStyles(theme => theme.palette["supportBase-15"]);

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-15"],
    zIndex: 1,
    paddingTop: theme.spacing["20p"],
  }));

  const backgroundBottomStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: -theme.spacing["24p"] + 1, // Small gap forms on iphone SE, 1 pixel added to remove this.
  }));

  return (
    <SafeAreaView style={headerStyle}>
      <NavHeader title={title} variant="background" />
      <View style={backgroundBottomStyle}>
        <BackgroundBottom color={backgroundAngledColor} />
      </View>
    </SafeAreaView>
  );
}
