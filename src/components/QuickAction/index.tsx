import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "@/components/Typography";
import { palette, spacing } from "@/theme/values";
import { Icons } from "@/assets/icons";

interface QuickActionProps {
  iconName: keyof Icons;
  title: string;
}

export default function QuickAction({ iconName, title }: QuickActionProps) {
  const Icon = Icons[iconName];

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.container}>
        <Icon height={24} width={24} style={styles.icon} />
        <Typography.Text color="primaryBase" weight="semiBold" size="callout">
          {title}
        </Typography.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: spacing.medium,
    backgroundColor: palette["neutralBase-50"],
    height: 95,
    margin: spacing.small,
    flex: 1,
  },
  wrapper: {
    flexDirection: "row",
    flexBasis: "33%",
  },
  icon: {
    marginBottom: spacing.small,
  },
});
