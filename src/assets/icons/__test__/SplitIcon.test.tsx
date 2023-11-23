import { create } from "react-test-renderer";

import { SplitIcon } from "../SplitIcon";

describe("icon/SplitIcon", () => {
  it("renders a SplitIcon", () => {
    const result = create(<SplitIcon />);

    expect(result).toMatchSnapshot();
  });
});
