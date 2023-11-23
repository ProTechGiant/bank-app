import { create } from "react-test-renderer";

import { ShareIcon } from "../ShareIcon";

describe("icon/ShareIcon", () => {
  it("renders a ShareIcon", () => {
    const result = create(<ShareIcon />);

    expect(result).toMatchSnapshot();
  });
});
