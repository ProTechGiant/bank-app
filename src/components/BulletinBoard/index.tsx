import { useState } from "react";
import { Dimensions, View } from "react-native";

import { Carousel } from "@/components/Carousel";
import { useThemeStyles } from "@/theme";

import BulletinTitle from "./BulletinTitle";
import SlideContent from "./SlideContent";

interface BulletinBoardProps<T> {
  data: T[];
  title: string;
}

export default function BulletinBoard<T>({ data, title }: BulletinBoardProps<T>) {
  const carouselWidth = useThemeStyles<number>(theme => Dimensions.get("screen").width - theme.spacing["16p"] * 2, []);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOnToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (data.length === 0) return null;

  return (
    <View>
      <BulletinTitle title={title} dropdownVisible={isExpanded} onPress={handleOnToggle} />
      {isExpanded && <Carousel data={data} Slide={SlideContent} width={carouselWidth} pagination="under" />}
    </View>
  );
}
