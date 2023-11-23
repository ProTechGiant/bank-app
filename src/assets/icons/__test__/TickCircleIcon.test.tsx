import { create } from "react-test-renderer";

import { TickCircleIcon } from "../TickCircleIcon";

describe("icon/TickCircleIcon", () => {
  it("renders a TickCircleIcon", () => {
    const result = create(<TickCircleIcon />);

    expect(result).toMatchSnapshot();
  });
});
