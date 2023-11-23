import { create } from "react-test-renderer";

import { SwipeIcon } from "../SwipeIcon";

describe("icon/SwipeIcon", () => {
  it("renders a SwipeIcon", () => {
    const result = create(<SwipeIcon />);

    expect(result).toMatchSnapshot();
  });
});
