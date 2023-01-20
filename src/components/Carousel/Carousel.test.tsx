import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";
import { create } from "react-test-renderer";

import Button from "../Button";
import { Carousel } from "./index";

const data = [
  {
    text: "Slide 1",
  },
  {
    text: "Slide 2",
  },
  {
    text: "Slide 3",
  },
];

const TestCarousel = () => {
  return (
    <View>
      <Carousel data={data} Slide={CarouselSlide} pagination="overlay" />
      <Text testID="printed-text">test</Text>
    </View>
  );
};

const CarouselSlide = ({ data }: { data: { text: string } }) => (
  <View testID="slide">
    <Text>{data.text}</Text>
  </View>
);

describe("components/Carousel", () => {
  it("renders a Carousel", () => {
    const result = create(<Carousel data={data} Slide={CarouselSlide} pagination="overlay" />);

    expect(result).toMatchSnapshot();
  });

  it("should render Slides", async () => {
    render(<TestCarousel />);
    const slides = await screen.getAllByTestId("slide");

    expect(slides.length).toBe(3);
  });
});
