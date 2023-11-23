import { create } from "react-test-renderer";

import { TrendingUpSmallIcon } from "../TrendingUpSmallIcon";

describe("icon/TrendingUpSmallIcon", () => {
  it("renders a TrendingUpSmallIcon", () => {
    const result = create(<TrendingUpSmallIcon />);

    expect(result).toMatchSnapshot();
  });
});
