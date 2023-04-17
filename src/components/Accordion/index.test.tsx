import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import Accordion from ".";

describe("features/Onboarding/components/Accordion", () => {
  it("renders with content", () => {
    render(
      <Accordion title="title">
        <Text>Content</Text>
      </Accordion>
    );

    expect(screen).toMatchSnapshot();
  });

  it("toggles when pressed", () => {
    render(
      <Accordion title="title">
        <Text>Content</Text>
      </Accordion>
    );

    const element = screen.getByText("title");

    expect(screen.queryByText("Content")).toBeFalsy();
    fireEvent.press(element);
    expect(screen.queryByText("Content")).toBeOnTheScreen();
  });
});
