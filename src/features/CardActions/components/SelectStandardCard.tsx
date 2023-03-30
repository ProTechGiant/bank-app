import { SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

import CardPlaceholder from "./CardPlaceholder";

interface SelectStandardCardProps {
  onPress: () => void;
  title: string;
}

export default function SelectStandardCard({ onPress, title }: SelectStandardCardProps) {
  const container = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    margin: theme.spacing["16p"],
  }));

  return (
    <SafeAreaView style={container}>
      <View style={styles.cardContainer}>
        <CardPlaceholder variant="standard" width="100%" />
      </View>
      <View style={styles.bottom}>
        <Button onPress={onPress}>{title}</Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottom: {
    alignSelf: "stretch",
  },
  cardContainer: {
    marginTop: 30,
  },
});
