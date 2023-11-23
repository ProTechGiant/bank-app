import { create } from "react-test-renderer";

import { PinIcon } from "../PinIcon";

describe("icon/PinIcon", () => {
  it("renders a PinIcon", () => {
    const result = create(<PinIcon />);

    expect(result).toMatchSnapshot();
  });
});
