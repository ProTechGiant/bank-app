import { fireEvent, render, screen } from "@testing-library/react-native";
import { useState } from "react";
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
  const [toggleText, setToggleText] = useState(false);
  const onPress = () => {
    setToggleText(!toggleText);
  };
  return (
    <View>
      <Carousel data={data} Slide={CarouselSlide} pagination={true} onPressSlide={onPress} />
      <Text testID="printed-text">{toggleText && "test"}</Text>
    </View>
  );
};

const CarouselSlide = ({ data, onPress }: { data: { text: string }; onPress: () => void }) => (
  <View testID="slide">
    <Text>{data.text}</Text>
    <Button onPress={onPress}>Press Me</Button>
  </View>
);

describe("components/Carousel", () => {
  it("renders a Carousel", () => {
    const result = create(<Carousel data={data} Slide={CarouselSlide} pagination={true} />);

    expect(result).toMatchSnapshot();
  });

  it("should render Slides", async () => {
    render(<TestCarousel />);
    const slides = await screen.getAllByTestId("slide");

    expect(slides.length).toBe(3);
  });

  it("should fire onPressSlide", async () => {
    render(<TestCarousel />);

    fireEvent.press(screen.getAllByText("Press Me")[0]);

    const output = await screen.findByTestId("printed-text");

    expect(output).toHaveTextContent("test");
  });
});
