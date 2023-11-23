import { create } from "react-test-renderer";

import { HideIcon } from "../HideIcon";

describe("icon/HideIcon", () => {
  it("renders a HideIcon", () => {
    const result = create(<HideIcon />);

    expect(result).toMatchSnapshot();
  });
});
