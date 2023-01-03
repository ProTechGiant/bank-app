import { radii, spacing } from "@/theme/values";
import { Image, StyleSheet, View } from "react-native";

interface ArticleSectionContentProps {
  data: { id: number; image: string };
}
export default function ArticleSectionContent({ data }: ArticleSectionContentProps) {
  return (
    <View style={styles.container}>
      <Image source={data.image} style={styles.imageContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.medium,
    borderRadius: radii.small,
  },
  imageContainer: {
    height: 440,
    width: "100%",
    borderRadius: radii.small,
  },
});
