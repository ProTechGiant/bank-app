import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import MoreInfoDropdown from "./MoreInfoDropdown";

describe("features/Onboarding/components/MoreInfoDropdown", () => {
  it("renders with content", () => {
    render(
      <MoreInfoDropdown title="title">
        <Text>Content</Text>
      </MoreInfoDropdown>
    );

    expect(screen).toMatchSnapshot();
  });

  it("toggles when pressed", () => {
    render(
      <MoreInfoDropdown title="title">
        <Text>Content</Text>
      </MoreInfoDropdown>
    );

    const element = screen.getByText("title");

    expect(screen.queryByText("Content")).toBeFalsy();
    fireEvent.press(element);
    expect(screen.queryByText("Content")).toBeOnTheScreen();
  });
});
