import { create } from "react-test-renderer";

import { DotIcon } from "../DotIcon";

describe("icon/DotIcon", () => {
  it("renders a DotIcon", () => {
    const result = create(<DotIcon />);

    expect(result).toMatchSnapshot();
  });
});
