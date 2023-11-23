import { create } from "react-test-renderer";

import { ArrowForwardIcon } from "../ArrowForwardIcon";

describe("icon/ArrowForwardIcon", () => {
  it("renders a ArrowForwardIcon", () => {
    const result = create(<ArrowForwardIcon />);

    expect(result).toMatchSnapshot();
  });
});
