import { create } from "react-test-renderer";

import { ThreeDotsCircleIcon } from "../ThreeDotsCircleIcon";

describe("icon/ThreeDotsCircleIcon", () => {
  it("renders a ThreeDotsCircleIcon", () => {
    const result = create(<ThreeDotsCircleIcon />);

    expect(result).toMatchSnapshot();
  });
});
