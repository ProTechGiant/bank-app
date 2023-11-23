import { create } from "react-test-renderer";

import { FilledRefreshIcon } from "../FilledRefreshIcon";

describe("icon/FilledRefreshIcon", () => {
  it("renders a FilledRefreshIcon", () => {
    const result = create(<FilledRefreshIcon />);

    expect(result).toMatchSnapshot();
  });
});
