import { create } from "react-test-renderer";

import { MediumRiskIcon } from "../MediumRiskIcon";

describe("icon/MediumRiskIcon", () => {
  it("renders a MediumRiskIcon", () => {
    const result = create(<MediumRiskIcon />);

    expect(result).toMatchSnapshot();
  });
});
