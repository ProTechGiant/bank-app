/**
 * NOTE: This story only works on the device toolbar found in Chrome as it simulated mobile events
 * The plugin to make react native element work in the web has some issues and causes:
 * * Loop prop does not loop in the storybook
 * * Pagination shows over the slides rather than below them
 * * Can not add padding to slides
 */

import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Text, View } from "react-native";

import { Carousel } from "@/components/Carousel";

const carouselData = [
  { text: "Slide 1" },
  { text: "Slide 2" },
  { text: "Slide 3" },
  { text: "Slide 4" },
  { text: "Slide 5" },
];

const SlideContent = ({ data }: { data: { text: string } }) => (
  <View>
    <Text>{data.text}</Text>
  </View>
);

export default {
  title: "components/Carousel",
  argTypes: {
    width: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof Carousel>;

const Template: ComponentStory<typeof Carousel> = args => (
  <View style={{ width: 500 }}>
    <Carousel data={args.data} width={args.width} Slide={args.Slide} pagination={args.pagination} loop={args.loop} />
  </View>
);

export const Default = Template.bind({});
Default.args = { data: carouselData, width: 500, Slide: SlideContent, loop: true };
