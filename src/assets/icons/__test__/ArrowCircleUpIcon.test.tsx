import { create } from "react-test-renderer";

import { ArrowCircleUpIcon } from "../ArrowCircleUpIcon";

describe("icon/ArrowCircleUpIcon", () => {
  it("renders a ArrowCircleUpIcon", () => {
    const result = create(<ArrowCircleUpIcon />);

    expect(result).toMatchSnapshot();
  });
});
