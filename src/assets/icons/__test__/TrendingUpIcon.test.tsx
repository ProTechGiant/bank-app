import { create } from "react-test-renderer";

import { TrendingUpIcon } from "../TrendingUpIcon";

describe("icon/TrendingUpIcon", () => {
  it("renders a TrendingUpIcon", () => {
    const result = create(<TrendingUpIcon />);

    expect(result).toMatchSnapshot();
  });
});
