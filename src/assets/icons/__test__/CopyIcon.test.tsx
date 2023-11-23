import { create } from "react-test-renderer";

import { CopyIcon } from "../CopyIcon";

describe("icon/CopyIcon", () => {
  it("renders a CopyIcon", () => {
    const result = create(<CopyIcon />);

    expect(result).toMatchSnapshot();
  });
});
