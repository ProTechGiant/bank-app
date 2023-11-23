import { create } from "react-test-renderer";

import { SwapIcon } from "../SwapIcon";

describe("icon/SwapIcon", () => {
  it("renders a SwapIcon", () => {
    const result = create(<SwapIcon />);

    expect(result).toMatchSnapshot();
  });
});
