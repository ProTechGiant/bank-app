import { create } from "react-test-renderer";

import { WarningFilledCircleIcon } from "../WarningFilledCircleIcon";

describe("icon/WarningFilledCircleIcon", () => {
  it("renders a WarningFilledCircleIcon", () => {
    const result = create(<WarningFilledCircleIcon />);

    expect(result).toMatchSnapshot();
  });
});
