import { create } from "react-test-renderer";

import { CheckCircleFilledIcon } from "../CheckCircleFilledIcon";

describe("icon/CheckCircleFilledIcon", () => {
  it("renders a CheckCircleFilledIcon", () => {
    const result = create(<CheckCircleFilledIcon />);

    expect(result).toMatchSnapshot();
  });
});
