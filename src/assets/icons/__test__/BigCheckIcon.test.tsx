import { create } from "react-test-renderer";

import { BigCheckIcon } from "../BigCheckIcon";

describe("icon/BigCheckIcon", () => {
  it("renders a BigCheckIcon", () => {
    const result = create(<BigCheckIcon />);

    expect(result).toMatchSnapshot();
  });
});
