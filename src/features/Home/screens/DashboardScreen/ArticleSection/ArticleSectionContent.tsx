import { Image, StyleSheet, View } from "react-native";

import { radii, spacing } from "@/theme/values";

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
    borderRadius: radii.small,
    marginHorizontal: spacing.medium,
  },
  imageContainer: {
    borderRadius: radii.small,
    height: 440,
    width: "100%",
  },
});
