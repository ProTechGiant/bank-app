import { Image, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export default function SelectLuxCard({ onPress }: { onPress: () => void }) {
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
        <Image style={{ height: 220, width: 380 }} source={require("@/assets/images/lux-card-placeholder.png")} />
      </View>
      <Typography.Text size="caption1" color="neutralBase" style={styles.text}>
        Lux is FREE when you upgrade to Croatia Plus
      </Typography.Text>
      <Button block onPress={onPress}>
        <Typography.Text color="neutralBase-50" size="body" weight="medium">
          Get Lux Card with Croatia Plus
        </Typography.Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
  },
});
