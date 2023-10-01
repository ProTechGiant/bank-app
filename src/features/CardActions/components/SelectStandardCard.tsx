import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActiveBankCard from "@/components/BankCard/ActiveBankCard";
import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

interface SelectStandardCardProps {
  onPress: () => void;
  title: string;
}

export default function SelectStandardCard({ onPress, title }: SelectStandardCardProps) {
  const bottomButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    alignSelf: "stretch",
  }));

  return (
    <SafeAreaView style={styles.containerStyle}>
      <View>
        <ActiveBankCard cardNumber="3232" cardType="1" productId="1356" />
      </View>
      <View style={bottomButtonContainerStyle}>
        <Button onPress={onPress}>{title}</Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
});
