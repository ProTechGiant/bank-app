import { create } from "react-test-renderer";

import { PlaceholderRefreshIcon } from "../PlaceholderRefreshIcon";

describe("icon/PlaceholderRefreshIcon", () => {
  it("renders a PlaceholderRefreshIcon", () => {
    const result = create(<PlaceholderRefreshIcon />);

    expect(result).toMatchSnapshot();
  });
});
