import { create } from "react-test-renderer";

import { DiamondSmallIcon } from "../DiamondSmallIcon";

describe("icon/DiamondSmallIcon", () => {
  it("renders a DiamondSmallIcon", () => {
    const result = create(<DiamondSmallIcon />);

    expect(result).toMatchSnapshot();
  });
});
