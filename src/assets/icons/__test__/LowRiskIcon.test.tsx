import { create } from "react-test-renderer";

import { LowRiskIcon } from "../LowRiskIcon";

describe("icon/LowRiskIcon", () => {
  it("renders a LowRiskIcon", () => {
    const result = create(<LowRiskIcon />);

    expect(result).toMatchSnapshot();
  });
});
