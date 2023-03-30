import { SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import LuxBottomBlueSvg from "../assets/lux-bottom-blue.svg";
import LuxCardBackgroundSvg from "../assets/lux-white-background.svg";
import CardPlaceholder from "./CardPlaceholder";

interface SelectLuxCardProps {
  onPress: () => void;
  title: string;
  remark: string;
}

export default function SelectLuxCard({ onPress, title, remark }: SelectLuxCardProps) {
  const container = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    margin: theme.spacing["16p"],
  }));

  return (
    <View style={styles.container}>
      <LuxCardBackgroundSvg style={styles.luxBackground} />
      <LuxBottomBlueSvg style={styles.bottomBlue} />
      <SafeAreaView style={container}>
        <View style={styles.cardContainer}>
          <CardPlaceholder variant="lux" width="100%" />
        </View>
        <View style={styles.bottom}>
          <Typography.Text size="caption1" color="primaryBase-20" align="center" style={styles.text}>
            {remark}
          </Typography.Text>
          <Button block onPress={onPress}>
            {title}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    alignSelf: "stretch",
  },
  bottomBlue: {
    bottom: 0,
    position: "absolute",
  },
  cardContainer: {
    marginTop: 30,
  },
  container: {
    flex: 1,
  },
  luxBackground: {
    position: "absolute",
    right: 0,
  },
  text: {
    marginVertical: 12,
  },
});
