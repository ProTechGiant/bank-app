import { create } from "react-test-renderer";

import { RewardsIcon } from "../RewardsIcon";

describe("icon/RewardsIcon", () => {
  it("renders a RewardsIcon", () => {
    const result = create(<RewardsIcon />);

    expect(result).toMatchSnapshot();
  });
});
