import { StyleSheet, View } from "react-native";
import SectionHeader from "@/components/SectionHeader";
import Typography from "@/components/Typography";
import { palette } from "@/theme/values";

export default function HomeDashboardScreen() {
  const getCardNumber = () => {
    return "8394 2748 2929";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography.Text color="neutralBase-50" weight="medium" size="callout">
          MAIN ACCOUNT
        </Typography.Text>
        <Typography.Text color="neutralBase-50">{getCardNumber()}</Typography.Text>
      </View>
      <SectionHeader title="Quick actions" subTitle={{ text: "Edit" }} />
      <SectionHeader title="Rewards" subTitle={{ text: "See all" }} />
      <SectionHeader title="Articles" subTitle={{ text: "See all" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  header: {
    backgroundColor: palette.primaryBase,
    alignItems: "center",
    width: "100%",
    padding: 20,
    paddingTop: 40,
  },
});
