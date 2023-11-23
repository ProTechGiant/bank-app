import { create } from "react-test-renderer";

import { MutualFundIcon } from "../MutualFundIcon";

describe("icon/MutualFundIcon", () => {
  it("renders a MutualFundIcon", () => {
    const result = create(<MutualFundIcon />);

    expect(result).toMatchSnapshot();
  });
});
