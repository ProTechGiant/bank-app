import { create } from "react-test-renderer";

import { ArrowIcon } from "../ArrowIcon";

describe("icon/ArrowIcon", () => {
  it("renders a ArrowIcon", () => {
    const result = create(<ArrowIcon />);

    expect(result).toMatchSnapshot();
  });
});
