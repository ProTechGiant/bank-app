import { create } from "react-test-renderer";

import { MobileIcon } from "../MobileIcon";

describe("icon/MobileIcon", () => {
  it("renders a MobileIcon", () => {
    const result = create(<MobileIcon />);

    expect(result).toMatchSnapshot();
  });
});
