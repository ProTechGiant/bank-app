import { create } from "react-test-renderer";

import { ClockIcon } from "../ClockIcon";

describe("icon/ClockIcon", () => {
  it("renders a ClockIcon", () => {
    const result = create(<ClockIcon />);

    expect(result).toMatchSnapshot();
  });
});
