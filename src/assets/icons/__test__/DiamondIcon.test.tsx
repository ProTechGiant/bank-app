import { create } from "react-test-renderer";

import { DiamondIcon } from "../DiamondIcon";

describe("icon/DiamondIcon", () => {
  it("renders a DiamondIcon", () => {
    const result = create(<DiamondIcon />);

    expect(result).toMatchSnapshot();
  });
});
