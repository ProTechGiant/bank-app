/**
 * NOTE: This story only works on the device toolbar found in Chrome as it simulated mobile events
 * The plugin to make react native element work in the web has some issues and causes:
 * * Loop prop does not loop in the storybook
 * * Pagination shows over the slides rather than below them
 * * Can not add padding to slides
 */

import { ComponentMeta, ComponentStory } from "@storybook/react";
import { GestureResponderEvent, Text, View } from "react-native";

import { Box } from "@/components/Box";
import { Carousel as CarouselComponent } from "@/components/Carousel";

const carouselData = [
  { text: "Slide 1" },
  { text: "Slide 2" },
  { text: "Slide 3" },
  { text: "Slide 4" },
  { text: "Slide 5" },
];

interface SlideContentProps {
  data: {
    text: string;
  };
  onPress?: (event: GestureResponderEvent) => void;
}

const SlideContent = ({ data }: SlideContentProps) => (
  <Box backgroundColor="bisque" padding="large">
    <Text>{data.text}</Text>
  </Box>
);

export default {
  title: "Layout/Carousel",
  argTypes: {
    width: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof CarouselComponent>;

const Template: ComponentStory<typeof CarouselComponent> = args => (
  <View style={{ width: 500 }}>
    <CarouselComponent
      data={args.data}
      width={args.width}
      Slide={args.Slide}
      pagination={args.pagination}
      loop={args.loop}
    />
  </View>
);

export const Carousel = Template.bind({});

Carousel.args = { data: carouselData, width: 500, Slide: SlideContent, pagination: true, loop: true };
