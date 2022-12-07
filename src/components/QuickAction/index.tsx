import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Icons } from "@/assets/icons";
import Typography from "@/components/Typography";
import { palette, spacing } from "@/theme/values";

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
    backgroundColor: palette["neutralBase-50"],
    flex: 1,
    height: 95,
    justifyContent: "center",
    margin: spacing.small,
    padding: spacing.medium,
  },
  icon: {
    marginBottom: spacing.small,
  },
  wrapper: {
    flexBasis: "33%",
    flexDirection: "row",
  },
});
