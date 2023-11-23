import { create } from "react-test-renderer";

import { HamburgerIcon } from "../HamburgerIcon";

describe("icon/HamburgerIcon", () => {
  it("renders a HamburgerIcon", () => {
    const result = create(<HamburgerIcon />);

    expect(result).toMatchSnapshot();
  });
});
