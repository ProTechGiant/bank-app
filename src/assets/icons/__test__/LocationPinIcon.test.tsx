import { create } from "react-test-renderer";

import { LocationPinIcon } from "../LocationPinIcon";

describe("icon/LocationPinIcon", () => {
  it("renders a LocationPinIcon", () => {
    const result = create(<LocationPinIcon />);

    expect(result).toMatchSnapshot();
  });
});
