import { SafeAreaView, ScrollView, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export default function SetAnotherAddressScreen() {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      flex: 1,
      padding: theme.spacing.medium,
    }),
    []
  );
  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingVertical: theme.spacing.medium,
    }),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={container}>
        <NavHeader title="Set another address" backButton={false} />
        <ScrollView>
          <View style={headerStyle}>
            <Typography.Text size="large" weight="bold">
              Enter your delivery address
            </Typography.Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
