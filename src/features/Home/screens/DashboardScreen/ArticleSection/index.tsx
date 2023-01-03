import { Dimensions } from "react-native";
import Carousel from "@/components/Carousel";
import { articleSectionData } from "@/mocks/articleSectionData";
import ArticleSectionContent from "./ArticleSectionContent";

export default function ArticleSection() {
  return (
    <Carousel
      data={articleSectionData}
      Slide={ArticleSectionContent}
      pagination={true}
      width={Dimensions.get("screen").width}
    />
  );
}
