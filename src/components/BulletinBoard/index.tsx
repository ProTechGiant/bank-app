import { useState } from "react";
import { Dimensions } from "react-native";

import { Carousel } from "@/components/Carousel";
import Dropdown from "@/components/Dropdown";
import { useThemeStyles } from "@/theme";

import BulletinTitle from "./BulletinTitle";
import SlideContent from "./SlideContent";

interface BulletinBoardProps<T> {
  data: T[];
  title: string;
}

export default function BulletinBoard<T>({ data, title }: BulletinBoardProps<T>) {
  const carouselWidth = useThemeStyles<number>(theme => Dimensions.get("screen").width - theme.spacing.medium * 2, []);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  if (data.length === 0) return null;

  return (
    <Dropdown
      title={<BulletinTitle title={title} dropdownVisible={dropdownVisible} onPress={toggleDropdown} />}
      dropdownVisible={dropdownVisible}
      content={<Carousel data={data} Slide={SlideContent} width={carouselWidth} pagination="under" />}
    />
  );
}
