import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { create } from "react-test-renderer";

import MoreInfoDropdown from "./MoreInfoDropdown";

describe("components/MoreInfoDropdown", () => {
  it("renders a MoreInfoDropdown", () => {
    const result = create(
      <MoreInfoDropdown title="TitleTest">
        <Text>BodyTest</Text>
      </MoreInfoDropdown>
    );

    expect(result).toMatchSnapshot();
  });
  it("opens dropdown on pressable", () => {
    const { getByText, queryByText } = render(
      <MoreInfoDropdown title="TestTitle">
        <Text>Body Content Test</Text>
      </MoreInfoDropdown>
    );

    const element = getByText("TestTitle");
    const initialContents = queryByText("Body Content Test");

    expect(initialContents).toBeNull();

    fireEvent.press(element);

    const openContents = queryByText("Body Content Test");
    expect(openContents).not.toBeNull();

    fireEvent.press(element);

    expect(initialContents).toBeNull();
  });
});
