import { GestureResponderEvent, StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "@/components/Typography";
import { spacing } from "@/theme/values";

interface SectionHeaderProps {
  title: string;
  subTitle?: { text: string; onPress?: (event: GestureResponderEvent) => void };
}

export default function SectionHeader({ title, subTitle }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Typography.Text size="footnote" weight="medium" color="primaryBase-20">
        {title.toUpperCase()}
      </Typography.Text>
      {subTitle?.onPress && (
        <TouchableOpacity onPress={subTitle.onPress}>
          <Typography.Text size="footnote" weight="medium" color="primaryBase-20">
            {subTitle.text}
          </Typography.Text>
        </TouchableOpacity>
      )}
      {!subTitle?.onPress && subTitle?.text && (
        <Typography.Text size="footnote" weight="medium" color="primaryBase-20">
          {subTitle.text}
        </Typography.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.medium,
    paddingHorizontal: spacing.medium,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
