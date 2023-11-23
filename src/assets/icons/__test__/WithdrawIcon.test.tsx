import { create } from "react-test-renderer";

import { WithdrawIcon } from "../WithdrawIcon";

describe("components/Carousel", () => {
  it("renders a Carousel", () => {
    const result = create(<WithdrawIcon />);

    expect(result).toMatchSnapshot();
  });
});
