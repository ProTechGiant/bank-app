import { Image, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export default function SelectStandardCard({ onPress }: { onPress: () => void }) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      flex: 1,
      justifyContent: "space-between",
      padding: theme.spacing.medium,
    }),
    []
  );

  return (
    <View style={container}>
      <View style={{ height: "80%" }}>
        <Image style={{ height: 220, width: 380 }} source={require("@/assets/images/standard-card-placeholder.png")} />
      </View>
      <Button block onPress={onPress}>
        <Typography.Text color="neutralBase-50" size="body" weight="medium">
          Get Standard Card for FREE
        </Typography.Text>
      </Button>
    </View>
  );
}
