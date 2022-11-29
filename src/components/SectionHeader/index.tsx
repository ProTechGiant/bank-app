import { GestureResponderEvent, StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "@/components/Typography";

interface SectionHeaderProps {
  title: string;
  subTitle?: { text: string; onPress?: (event: GestureResponderEvent) => void };
}

export default function SectionHeader({ title, subTitle }: SectionHeaderProps) {
  console.log("subtitle", subTitle);
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
        <TouchableOpacity onPress={subTitle.onPress}>
          <Typography.Text size="footnote" weight="medium" color="primaryBase-20">
            {subTitle.text}
          </Typography.Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
