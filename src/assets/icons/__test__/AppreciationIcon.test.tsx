import { create } from "react-test-renderer";

import { AppreciationIcon } from "../AppreciationIcon";

describe("icon/AppreciationIcon", () => {
  it("renders a AppreciationIcon", () => {
    const result = create(<AppreciationIcon />);

    expect(result).toMatchSnapshot();
  });
});
