import { create } from "react-test-renderer";

import { CancelCircleFilledIcon } from "../CancelCircleFilledIcon";

describe("icon/CancelCircleFilledIcon", () => {
  it("renders a CancelCircleFilledIcon", () => {
    const result = create(<CancelCircleFilledIcon />);

    expect(result).toMatchSnapshot();
  });
});
