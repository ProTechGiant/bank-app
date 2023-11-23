import { create } from "react-test-renderer";

import { HighRiskIcon } from "../HighRiskIcon";

describe("icon/HighRiskIcon", () => {
  it("renders a HighRiskIcon", () => {
    const result = create(<HighRiskIcon />);

    expect(result).toMatchSnapshot();
  });
});
