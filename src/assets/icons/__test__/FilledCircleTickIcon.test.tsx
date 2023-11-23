import { create } from "react-test-renderer";

import { FilledCircleTickIcon } from "../FilledCircleTickIcon";

describe("icon/FilledCircleTickIcon", () => {
  it("renders a FilledCircleTickIcon", () => {
    const result = create(<FilledCircleTickIcon />);

    expect(result).toMatchSnapshot();
  });
});
