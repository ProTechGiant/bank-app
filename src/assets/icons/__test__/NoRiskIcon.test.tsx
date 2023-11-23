import { create } from "react-test-renderer";

import { NoRiskIcon } from "../NoRiskIcon";

describe("icon/NoRiskIcon", () => {
  it("renders a NoRiskIcon", () => {
    const result = create(<NoRiskIcon />);

    expect(result).toMatchSnapshot();
  });
});
