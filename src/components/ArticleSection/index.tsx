import { spacing } from "@/theme/values";
import { Dimensions, StyleSheet, View } from "react-native";
import Carousel from "@/components/Carousel";
import { articleSectionData } from "@/mocks/articleSectionData";
import ArticleSectionContent from "./articleSectionContent";

export default function ArticleSection() {
  return (
    <View style={styles.container}>
      <Carousel
        data={articleSectionData}
        Slide={ArticleSectionContent}
        pagination={true}
        width={Dimensions.get("screen").width}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xlarge,
  },
});
